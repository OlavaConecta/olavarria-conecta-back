import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Tienda])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
