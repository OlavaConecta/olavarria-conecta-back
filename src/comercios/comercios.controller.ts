import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComerciosService } from './comercios.service';
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comerciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComercioDto: UpdateComercioDto) {
    return this.comerciosService.update(+id, updateComercioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comerciosService.remove(+id);
  }
}
