import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly cloudinaryService: CloudinaryService
  ) { }
  async create(createProductoDto: any, file: Express.Multer.File): Promise<Producto> {
  try {
    let urlImagen = "";

    if (file) {
      console.log('Subiendo a Cloudinary archivo:', file.originalname);
      // Forzamos la espera de la URL
      urlImagen = await this.cloudinaryService.uploadFile(file);
      console.log('URL recibida de Cloudinary:', urlImagen);
    } else {
      console.log('No llegó ningún archivo al servicio');
    }

    const nuevoProducto = this.productoRepository.create({
      titulo: createProductoDto.titulo,
      descripcion: createProductoDto.descripcion,
      precio: Number(createProductoDto.precio),
      imagen: urlImagen, // Si esto sigue llegando "", el problema es el uploadFile
      tienda: { id: Number(createProductoDto.tiendaId) }
    });

    return await this.productoRepository.save(nuevoProducto);
  } catch (error) {
    console.error('Error crítico en el servicio:', error);
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
      const newImageUrl = await this.cloudinaryService.uploadFile(file);
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
async updatePrecioYStock(id: number, precio: number): Promise<Producto> {
  const producto = await this.productoRepository.findOne({ where: { id } });
  
  if (!producto) throw new NotFoundException('Producto no encontrado');

  // Solo actualizamos el precio. 
  // Al no pasar por la lógica de 'file', no hay riesgo de borrar nada en Cloudinary.
  producto.precio = Number(precio);
  
  return await this.productoRepository.save(producto);
}

 async remove(id: number) {
  const producto = await this.productoRepository.findOne({ where: { id } });
  if (!producto) throw new NotFoundException('Producto no encontrado');

  // IMPORTANTE: Si un comercio borra un producto, 
  // aprovechamos tu lógica de Cloudinary para no dejar basura en la nube.
  if (producto.imagen) {
    try {
      const urlParts = producto.imagen.split('/');
      const fileName = urlParts[urlParts.length - 1].split('.')[0];
      // Ajustá esto a tu carpeta: 'olavarria_conecta/productos/...'
      const publicId = `olavarria_conecta/productos/${fileName}`; 
      await this.cloudinaryService.deleteFile(publicId);
    } catch (e) {
      console.warn('No se pudo borrar de Cloudinary, pero procedemos con la DB');
    }
  }

  await this.productoRepository.remove(producto);
}
}