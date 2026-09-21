import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { Tienda } from './entities/tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comercio } from 'src/comercios/entities/comercio.entity';


@Injectable()
export class TiendasService {
  [x: string]: any;
  constructor(
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
    @InjectRepository(Comercio)
    private readonly comercioRepository: Repository<Comercio>,
     
    
    private readonly cloudinaryService: CloudinaryService,
    
  ) { }

  private async generarSlugUnico(nombre: string): Promise<string> {
    const baseSlug = slugify(nombre, { lower: true, strict: true });

    const existe = await this.tiendaRepository.findOneBy({ slug: baseSlug });
    if (!existe) return baseSlug;

    const suffix = Math.random().toString(36).substring(2, 5);
    return `${baseSlug}-${suffix}`;
  }


  async save(datos: any) {
    try {
      // 1. Validar si el comercio ya tiene una tienda registrada (opcional pero recomendado)
      if (datos.comercioId) {
        const tiendaExistente = await this.tiendaRepository.findOne({
          where: { comercio: { id: datos.comercioId } },
        });
        if (tiendaExistente) {
          throw new BadRequestException('El comercio ya tiene una tienda registrada.');
        }
      }

      // SE AGREGA PLAN POR DEFECTO A BASICO.
      if (!datos.planId && !datos.plan) {
        datos.planId = 1; // ID 1 = Plan Básico por defecto (hasta 10 productos)
      }

      // 2. Creamos la instancia de la entidad con los datos que vienen del controller
      const nuevaTienda: any = this.tiendaRepository.create(datos);
      if (datos.nombre) {
        nuevaTienda.slug = await this.generarSlugUnico(datos.nombre);
      }

      // 3. La guardamos físicamente en MySQL
      return await this.tiendaRepository.save(nuevaTienda);
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al guardar en el Repositorio:', mensaje);
      throw error;
    }
  }

  async findOneBySlug(slug: string): Promise<Tienda | null> {
    const tienda = await this.tiendaRepository.findOne({
      where: { slug },
      relations: ['plan', 'productos']
    })
    if (!tienda) throw new NotFoundException(`Tienda con slug ${slug} no encontrada`);
    return tienda;
  }

  async findAll(): Promise<Tienda[]> {
    return this.tiendaRepository.find({
      relations: ['plan', 'productos']
    });
  }

  async findOne(id: number): Promise<Tienda | null> {
    const tienda = await this.tiendaRepository.findOneBy({ id });
    if (!tienda) {
      throw new NotFoundException(`Tienda with id ${id} not found`);
    }
    return tienda;
  }

  async update(id: number, updateTiendaDto: UpdateTiendaDto, imagenUrl?: string) {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
    if (!tienda) throw new NotFoundException('Tienda no encontrada');

    const { planId, categoria, ...datosSimples } = updateTiendaDto;
    Object.assign(tienda, datosSimples);

    // --- LÓGICA DE BORRADO OPCIÓN A ---
    if (imagenUrl && tienda.imagen) {
      try {
        // 1. Extraemos el public_id de la URL vieja
        // Ejemplo de URL: https://res.cloudinary.com/demo/image/upload/v12345/olavarria_conecta/nombre_imagen.webp
        const urlParts = tienda.imagen.split('/');
        const folder = urlParts[urlParts.length - 2]; // 'olavarria_conecta'
        const fileNameWithExtension = urlParts[urlParts.length - 1]; // 'nombre_imagen.webp'
        const publicId = `${folder}/${fileNameWithExtension.split('.')[0]}`; // 'olavarria_conecta/nombre_imagen'

        // 2. Mandamos a borrar a la nube
        await this.cloudinaryService.deleteFile(publicId);
        console.log('Imagen anterior borrada de Cloudinary:', publicId);
      } catch (error) {
        // Usamos un console.warn para que si falla el borrado, la app siga funcionando igual
        console.warn('No se pudo borrar la imagen vieja, pero procedemos con el update:', error);
      }
    }

    // 3. Asignamos la nueva imagen
    if (imagenUrl) {
      tienda.imagen = imagenUrl;
    }

    return await this.tiendaRepository.save(tienda);
  }

  async actualizarTiendaPorComercio(comercioId: number, updateTiendaDto: UpdateTiendaDto, imagenUrl?: string) {
    // Buscamos la tienda usando la relación correcta de TypeORM
    const tienda = await this.tiendaRepository.findOne({
      where: { comercio: { id: comercioId } }
    });

    if (!tienda) {
      throw new NotFoundException('No se encontró la tienda asociada a este comercio');
    }

    const { planId, categoria, ...datosSimples } = updateTiendaDto;
    // 3. Asignamos los datos simples de forma segura
    Object.assign(tienda, datosSimples);

    // 4. Asignamos correctamente la categoría si viene en el DTO
    if (categoria !== undefined) {
      tienda.categoria = categoria;
    }

    // 5. ASIGNACIÓN DE PLAN (Manejo robusto para que nunca quede en null)
    const idPlanAUsar = planId ? Number(planId) : 1; // Si viene del front lo usa, sino por defecto usa el Plan 1 (Básico)
    
    // Asignamos tanto la propiedad relacional como el campo ID por si lo tenés mapeado en la entidad
    tienda.plan = { id: idPlanAUsar } as any; 
    if ('planId' in tienda) {
      (tienda as any).planId = idPlanAUsar;
    }

    // 6. Lógica del Slug: Si viene un nombre nuevo, o si la tienda todavía no tiene slug, lo generamos
    const nombreAUsar = updateTiendaDto.nombre || tienda.nombre;
    if (nombreAUsar && (nombreAUsar !== tienda.slug || !tienda.slug)) {
      tienda.slug = await this.generarSlugUnico(nombreAUsar);
    }
    // Lógica de Cloudinary para la imagen (si subió una nueva)
    if (imagenUrl && tienda.imagen) {
      try {
        const urlParts = tienda.imagen.split('/');
        const folder = urlParts[urlParts.length - 2];
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `${folder}/${fileNameWithExtension.split('.')[0]}`;
        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        console.warn('No se pudo borrar la imagen vieja de Cloudinary, continuando...', error);
      }
    }

    if (imagenUrl) {
      tienda.imagen = imagenUrl;
    }
    //7. ACTUALIZAR EL `nombreLocal` EN LA TABLA COMERCIO
    // =========================================================================
    if (updateTiendaDto.nombre) {
      await this.comercioRepository.update(comercioId, {
        nombreLocal: updateTiendaDto.nombre,
      });
    }

    return await this.tiendaRepository.save(tienda);
  }


  //Logica para actualizar el plan de una tienda
async actualizarPlan(tiendaId: number, planId: number) {
  const tienda = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
  if (!tienda) {
    throw new NotFoundException('Tienda no encontrada');
  }
  tienda.plan = { id: planId } as any;
  return await this.tiendaRepository.save(tienda);
}


  async remove(id: number) {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
    if (!tienda) {
      throw new NotFoundException('tienda no encontrada');
    }
    // 2. Definimos la lógica de borrado de imágenes
    const borrarImagenCloudinary = async (url: string) => {
      if (!url) return;
      try {
        const partes = url.split('/');
        const nombreArchivoConExtension = partes[partes.length - 1];
        const carpeta = partes[partes.length - 2];
        const nombreSinExtension = nombreArchivoConExtension.split('.')[0];
        const publicId = `${carpeta}/${nombreSinExtension}`;

        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        console.error('Error al borrar en Cloudinary:', error);
      }
    }; // <--- Aquí cierra la función interna

    // 3. Borramos fotos de productos de Olavarría Conecta
    if (tienda.productos && tienda.productos.length > 0) {
      for (const producto of tienda.productos) {
        await borrarImagenCloudinary(producto.imagen);
      }
    }

    // 4. Borramos el logo de la tienda
    await borrarImagenCloudinary(tienda.imagen);

    // 5. Borramos de MySQL (lo que hacía tu original)
    return await this.tiendaRepository.remove(tienda);
  }
}