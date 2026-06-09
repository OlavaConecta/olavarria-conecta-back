import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { FarmaciasService } from './farmacias.service';
import { FarmaciasController } from './farmacias.controller';
import {Farmacia} from "./entities/farmacia.entity";
import {FarmaciaTurno} from "./entities/farmacia-turno.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Farmacia, FarmaciaTurno])],
  controllers: [FarmaciasController],
  providers: [FarmaciasService],
})
export class FarmaciasModule {}
