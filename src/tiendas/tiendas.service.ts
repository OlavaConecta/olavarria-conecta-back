import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { Tienda } from './entities/tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TiendasService {

  constructor(
    @InjectRepository(Tienda) private readonly tiendaRepository: Repository<Tienda>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  // Este es el método que realmente guarda en MySQL
async create(createTiendaDto: any, file: Express.Multer.File): Promise<Tienda> {
  try {
    let urlImagen = "";
    if (file) {
      urlImagen = await this.cloudinaryService.uploadImage(file);
    }

    const nuevaTienda = this.tiendaRepository.create({
      nombre: createTiendaDto.nombre,
      whatsapp: createTiendaDto.whatsapp,
      direccion: createTiendaDto.direccion,
      horario: createTiendaDto.horario,
      categoria: createTiendaDto.categoria,
      activo: createTiendaDto.activo || '1', // Por defecto '1' como en tu ejemplo
      imagen: urlImagen, 
      plan: { id: Number(createTiendaDto.planId) }
    });

    return await this.tiendaRepository.save(nuevaTienda);
  } catch (error) {
    throw new InternalServerErrorException('Error al guardar en MySQL');
  }
}


  async findAll(): Promise<Tienda[]> {
    return this.tiendaRepository.find({
      relations: ['plan', 'productos']
    });
  }

  async findOne(id: number): Promise<Tienda | null> {
    const tienda = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['plan', 'productos']
    });
    if (!tienda) {
      throw new NotFoundException(`Tienda with id ${id} not found`);
    }
    return tienda;
  }

  async update(id: number, updateTiendaDto: UpdateTiendaDto, imagenUrl?: string) {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
    if (!tienda) throw new NotFoundException('Tienda no encontrada');

    const { planId, ...datosSimples } = updateTiendaDto;
    Object.assign(tienda, datosSimples);

    // Lógica de borrado de imagen vieja en Cloudinary
    if (imagenUrl && tienda.imagen) {
      try {
        const urlParts = tienda.imagen.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        // Asumiendo que la carpeta en Cloudinary es 'olavarria_conecta'
        const publicId = `olavarria_conecta/${fileNameWithExtension.split('.')[0]}`;

        await this.cloudinaryService.deleteFile(publicId);
        console.log('Imagen anterior borrada:', publicId);
      } catch (error) {
        console.warn('No se pudo borrar la imagen vieja:', error);
      }
    }

    if (imagenUrl) {
      tienda.imagen = imagenUrl;
    }

    if (planId) {
      tienda.plan = { id: planId } as any;
    }

    return await this.tiendaRepository.save(tienda);
  }

  async remove(id: number) {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
    if (!tienda) {
      throw new NotFoundException('tienda no encontrada');
    }
    await this.tiendaRepository.remove(tienda);
  }
}