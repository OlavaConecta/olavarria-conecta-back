import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComerciosService } from './comercios.service';
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comercios')
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) { }

  @Post()
  async create(@Body() createComercioDto: CreateComercioDto) {
    const comercioGuardado = await this.comerciosService.create(createComercioDto);
    
    return {
      ok: true,
      comercio: comercioGuardado,
      necesitaOnboarding: true, // Esto le avisa al frontend que debe redirigir
    };
  }

  @Get()
  findAll() {
    return this.comerciosService.findAll();
  }

  //Get de comercio por nombre de usuario
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

  return this.comerciosService.update(+id, updateComercioDto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comerciosService.remove(+id);
  }
}
