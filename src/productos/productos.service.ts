import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
  ) { }
  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const {tiendaId,...datosProducto} = createProductoDto;
      const nuevoProducto = this.productoRepository.create({...datosProducto,tienda:{id:tiendaId}});
      return await this.productoRepository.save(nuevoProducto);
    } catch (error) {
      console.error('error al crear producto', error);
      throw new InternalServerErrorException('Error al crear producto');
    };
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

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto){
      throw new NotFoundException('Producto no encontrado');
    }
    Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: number) {
   const producto = await this.productoRepository.findOne({ where: { id } });
   if(!producto){
    throw new NotFoundException('Producto no encontrado');
   }
   await this.productoRepository.remove(producto);
  }
}
