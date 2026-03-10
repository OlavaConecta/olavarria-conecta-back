import { Module } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { Planes } from './entities/plane.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Planes])
  ],
  controllers: [PlanesController],
  providers: [PlanesService],
  exports:[PlanesService]
})
export class PlanesModule {}
