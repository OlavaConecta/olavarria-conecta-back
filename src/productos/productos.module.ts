import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Tienda } from 'src/tiendas/entities/tienda.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Producto,Tienda])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports:[ProductosService]
})
export class ProductosModule {}
