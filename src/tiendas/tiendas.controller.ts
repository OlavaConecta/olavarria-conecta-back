import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tienda } from './entities/tienda.entity';

@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService, private readonly cloudinaryService: CloudinaryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('imagen_archivo'))
  async create(
    @Body() createTiendaDto: CreateTiendaDto,
    @UploadedFile() file: Express.Multer.File // Capturamos el archivo aquí
  ) {
    let imageUrl = '';

    // Si el usuario envió una imagen desde su PC
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      imageUrl = result.secure_url; // Aquí ya tenés la URL .webp de Cloudinary
    }

    // Le pasamos al servicio el DTO y la URL de la imagen
    return this.tiendasService.create(createTiendaDto, imageUrl);
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
  @UseInterceptors(FileInterceptor('imagen_archivo')) // 1. Agregamos el interceptor
  async update(
    @Param('id') id: string,
    @Body() updateTiendaDto: UpdateTiendaDto,
    @UploadedFile() file: Express.Multer.File // 2. Capturamos el archivo si viene
  ) :Promise <Tienda>{
    let imageUrl : string | undefined = undefined; // Usamos undefined para que el service sepa si hubo cambio o no

    // 3. Si el usuario subió una imagen nueva para editar
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      imageUrl = result.secure_url;
    }

    // 4. Ahora le pasamos el tercer parámetro al Service
    return this.tiendasService.update(+id, updateTiendaDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}
