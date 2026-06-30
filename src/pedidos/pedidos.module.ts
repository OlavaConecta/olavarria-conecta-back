import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido,Tienda, Producto])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
