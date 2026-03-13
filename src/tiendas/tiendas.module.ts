import { forwardRef, Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { Tienda } from './entities/tienda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Planes } from 'src/planes/entities/plane.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Tienda,Categoria, Producto, Planes, CloudinaryModule]),
    // forwardRef(() => ProductosModule),
  ],
  controllers: [TiendasController],
  providers: [TiendasService,TypeOrmModule],
  exports:[TypeOrmModule]
})
export class TiendasModule {}
