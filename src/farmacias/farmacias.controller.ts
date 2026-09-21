import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';
// 1. IMPORTÁ TU DTO DE TURNO ACÁ (Ajustá la ruta si tu archivo se llama distinto)
import { CreateTurnoDto } from './dto/create-turno.dto'; 
import { FarmaciaTurno } from './entities/farmacia-turno.entity';

//IMPORTACIONES DE HERRAMIENTAS DE SEGURIDAD
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {RolesGuard} from '../auth/roles.guard';
import {Roles} from '../auth/roles.decorator';


@Controller('farmacias')
export class FarmaciasController {
  constructor(private readonly farmaciasService: FarmaciasService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createFarmaciaDto: CreateFarmaciaDto) {
    return this.farmaciasService.create(createFarmaciaDto);
  }


  @Post('turnos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createTurno(@Body() createTurnoDto: CreateTurnoDto) {
    return this.farmaciasService.createTurno(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.farmaciasService.findAll();
  }

  @Get('turno-hoy')
async findFarmaciaDeTurnoHoy(): Promise<FarmaciaTurno[]> { // 👈 Asegurate que tenga los corchetes []
  return this.farmaciasService.findFarmaciaDeTurnoHoy();
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmaciasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateFarmaciaDto: UpdateFarmaciaDto) {
    return this.farmaciasService.update(+id, updateFarmaciaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.farmaciasService.remove(+id);
  }
}