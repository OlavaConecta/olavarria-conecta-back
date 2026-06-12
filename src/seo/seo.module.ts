import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { FarmaciasModule } from '../farmacias/farmacias.module'; // <-- Solo dejamos este
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Module({
  imports: [FarmaciasModule, TypeOrmModule.forFeature([Tienda])], // Le da acceso al SeoService a la tabla de farmacias
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}