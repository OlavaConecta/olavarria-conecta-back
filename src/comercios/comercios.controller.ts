import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ComerciosService } from './comercios.service';
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comercios')
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) { }

  @Post()
  create(@Body() createComercioDto: CreateComercioDto) {
    return this.comerciosService.create(createComercioDto);
  }

  @Get()
  findAll() {
    return this.comerciosService.findAll();
  }
  @Get('nombre/:nombreUsuario')
  async findOneByNombre(@Param('nombreUsuario') nombreUsuario: string) {
    return this.comerciosService.findOneByNombreUsuario(nombreUsuario);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comerciosService.findOne(+id);
  }


@Patch(':id')
async update(
  @Param('id') id: string, 
  @Body() updateComercioDto: UpdateComercioDto,
) {
  // Versión vieja: actualiza directo el comercio o producto sin chequear req.user
  return this.comerciosService.update(+id, updateComercioDto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comerciosService.remove(+id);
  }
}
