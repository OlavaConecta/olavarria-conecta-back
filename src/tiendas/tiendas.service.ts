import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { Tienda } from './entities/tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TiendasService {
  [x: string]: any;
  constructor(
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
  ) {}

  async save(datos: any) {
    try {
      // 1. Creamos la instancia de la entidad con los datos que vienen del controller
      const nuevaTienda = this.tiendaRepository.create(datos);
      
      // 2. La guardamos físicamente en MySQL
      return await this.tiendaRepository.save(nuevaTienda);
    } catch (error:unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al guardar en el Repositorio:', mensaje);
      throw error;
    }
  }

  async findAll(): Promise <Tienda[]> {
    return this.tiendaRepository.find({
      relations: ['plan', 'productos']
    });
  }

  async findOne(id: number) :Promise <Tienda | null>{
   const tienda = await this.tiendaRepository.findOneBy({id});
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

  async remove(id: number) {
    const tienda = await this.tiendaRepository.findOne({where:{id}});
    if (!tienda){
      throw new NotFoundException('tienda no encontrada');
    }
    await this.tiendaRepository.remove(tienda);
  
}
}
