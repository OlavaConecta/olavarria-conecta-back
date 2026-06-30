import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    
    // 1. Inyectamos el repositorio de Tienda aquí
    @InjectRepository(Tienda)
    private tiendaRepository: Repository<Tienda>, 

    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>
  ) {}

 async create(createPedidoDto: CreatePedidoDto) {
    const { items, tiendaId, ...restoDelPedido } = createPedidoDto;

    // Buscamos la tienda
    const tienda = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
    if (!tienda) throw new Error('La tienda no existe');

    // 2. Aquí es donde ocurre la magia: "congelamos" la información
    const itemsEnriquecidos = await Promise.all(
      items.map(async (item) => {
        const producto = await this.productoRepository.findOne({ 
          where: { id: item.productoId } 
        });

        return {
          productoId: item.productoId,
          nombre: producto ? producto.titulo : 'Producto eliminado',
          precioUnitario: producto ? producto.precio : 0,
          cantidad: item.cantidad
        };
      })
    );
    const nuevoPedido = this.pedidosRepository.create({
      ...restoDelPedido,
      tienda: tienda,
      items: itemsEnriquecidos // Guardamos el array enriquecido como JSON
    });
    return await this.pedidosRepository.save(nuevoPedido);
  }

  async findAll() {
    return await this.pedidosRepository.find({
      relations: ['tienda']
    });
  }
  
  async findAllByTienda(tiendaId:number){
    return await this.pedidosRepository.find({
      where:{tienda:{id:tiendaId}},
      relations: {tienda:true},
      order:{id:'DESC'}
    });

  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  async remove(id: number) {
    return await this.pedidosRepository.delete(id);
  }
}
