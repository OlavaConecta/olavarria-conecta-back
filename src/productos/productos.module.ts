import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Producto,Tienda]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports:[ProductosService]
})
export class ProductosModule {}
