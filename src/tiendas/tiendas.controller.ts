import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tienda } from './entities/tienda.entity';

@Controller('tiendas')
export class TiendasController {
  constructor(
    private readonly tiendasService: TiendasService, 
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('imagen_archivo'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateTiendaDto
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo en "imagen_archivo"');
    }

    // 1. Subir la imagen y obtener la URL string
    const imageUrl = await this.cloudinaryService.uploadImage(file);

    // 2. Llamamos directamente al método CREATE del servicio
    // Le pasamos el DTO y el string de la imagen por separado
    return this.tiendasService.create(createDto, imageUrl);
  }

  @Get()
  findAll() {
    return this.tiendasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiendasService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen_archivo'))
  async update(
    @Param('id') id: string,
    @Body() updateTiendaDto: UpdateTiendaDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Tienda> {
    let imageUrl: string | undefined = undefined;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      imageUrl = result;
    }

    return this.tiendasService.update(+id, updateTiendaDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}