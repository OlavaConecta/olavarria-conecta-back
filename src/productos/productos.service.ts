import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductosService {
  cloudinaryService: any;
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
  ) { }
  async create(createProductoDto: any, file: Express.Multer.File): Promise<Producto> {
  try {
    let imageUrl = '';

    // 1. Subida a Cloudinary
    if (file) {
      imageUrl = await this.cloudinaryService.uploadFile(file, 'olavarria_conecta/productos');
    console.log('2. URL generada por Cloudinary:', imageUrl);
    }

    // 2. Mapeo manual para asegurar que coincida con tu @Entity()
    // Convertimos a número porque desde el Front llega como String
    const nuevoProducto = this.productoRepository.create({
      titulo: createProductoDto.titulo,
      descripcion: createProductoDto.descripcion,
      precio: Number(createProductoDto.precio),
      imagen: imageUrl, // Aquí guardamos la URL final
      tienda: { id: Number(createProductoDto.tiendaId) }
    });

    // 3. Guardado en MySQL
    return await this.productoRepository.save(nuevoProducto);

  } catch (error) {
    // Esto te ayudará a ver el error real en los logs de Railway si falla algo más
    console.error('Error detallado en productos.service:', error);
    throw new InternalServerErrorException('Error al crear el producto');
  }
}

  async findAllByTienda(tiendaId: number): Promise<Producto[]> {
  return await this.productoRepository.find({
    where: {tienda:{id:tiendaId}},
    loadRelationIds: true
  })}
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['tienda']
    });
  }

  async findOne(id: number): Promise<Producto | null> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado')
    };
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto, file: Express.Multer.File): Promise<Producto> {
  try {
    // 1. Buscamos el producto actual para saber si ya tiene una imagen
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const { tiendaId, ...datosUpdate } = updateProductoDto;

    // 2. Si viene un archivo nuevo, procesamos la imagen
    if (file) {
      // Borrar la imagen vieja de Cloudinary si existe
      if (producto.imagen) {
        try {
          // Extraemos el public_id (ej: olavarria_conecta/productos/nombre_archivo)
          const urlParts = producto.imagen.split('/');
          const folder = urlParts[urlParts.length - 2]; 
          const rootFolder = urlParts[urlParts.length - 3];
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          const publicId = `${rootFolder}/${folder}/${fileName}`;
          
          await this.cloudinaryService.deleteFile(publicId);
        } catch (e) {
          console.warn('No se pudo borrar la imagen vieja, posiblemente ya no existía.');
        }
      }

      // Subir la nueva imagen
      const newImageUrl = await this.cloudinaryService.uploadFile(file, 'olavarria_conecta/productos');
      producto.imagen = newImageUrl;
    }

    // 3. Actualizamos los datos (incluyendo la relación con la tienda si cambió)
    if (tiendaId) {
      producto.tienda = { id: tiendaId } as any;
    }
    
    Object.assign(producto, datosUpdate);

    return await this.productoRepository.save(producto);

  } catch (error) {
    console.error('Error al actualizar producto', error);
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Error al actualizar producto');
  }
}

  async remove(id: number) {
   const producto = await this.productoRepository.findOne({ where: { id } });
   if(!producto){
    throw new NotFoundException('Producto no encontrado');
   }
   await this.productoRepository.remove(producto);
  }
}
