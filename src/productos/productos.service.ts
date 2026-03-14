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
    let urlImagen = "";

    // 1. Llamada exacta a como está definido en tu CloudinaryService
    if (file) {
      // SOLO pasamos el 'file', sin el segundo argumento de la carpeta
      urlImagen = await this.cloudinaryService.uploadFile(file); 
    }

    // 2. Creación del objeto Producto
    const nuevoProducto = this.productoRepository.create({
      titulo: createProductoDto.titulo,
      descripcion: createProductoDto.descripcion,
      precio: Number(createProductoDto.precio),
      imagen: urlImagen, // Aquí debería llegar el secure_url de Cloudinary
      tienda: { id: Number(createProductoDto.tiendaId) }
    });

    // 3. Guardado final
    return await this.productoRepository.save(nuevoProducto);

  } catch (error) {
    console.error('Error al crear producto:', error);
    throw new InternalServerErrorException('Error en la creación del producto');
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
