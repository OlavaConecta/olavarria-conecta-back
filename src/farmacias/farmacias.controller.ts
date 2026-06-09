import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';
// 1. IMPORTÁ TU DTO DE TURNO ACÁ (Ajustá la ruta si tu archivo se llama distinto)
import { CreateTurnoDto } from './dto/create-turno.dto'; 
import { FarmaciaTurno } from './entities/farmacia-turno.entity';

@Controller('farmacias')
export class FarmaciasController {
  constructor(private readonly farmaciasService: FarmaciasService) { }

  @Post()
  create(@Body() createFarmaciaDto: CreateFarmaciaDto) {
    return this.farmaciasService.create(createFarmaciaDto);
  }

  // 🎯 2. CAMBIÁ ESTA LÍNEA PARA USAR TU DTO REAL
  @Post('turnos')
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
  update(@Param('id') id: string, @Body() updateFarmaciaDto: UpdateFarmaciaDto) {
    return this.farmaciasService.update(+id, updateFarmaciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmaciasService.remove(+id);
  }
}