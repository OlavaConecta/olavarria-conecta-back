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
  @UploadedFile() file: Express.Multer.File,
  @Body() createDto: CreateTiendaDto
) {
  // 1. Subir solo la imagen a Cloudinary
  const imageUrl = await this.cloudinaryService.uploadImage(file);

  // 2. Combinar la URL con el resto de los datos para la DB
  const datosCompletos = {
    ...createDto,
    imagenUrl: imageUrl, // Solo guardamos el string
  };

  // 3. Guardar en MySQL a través de tu servicio de TypeORM/Sequelize
  return this.tiendasService.save(datosCompletos);
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
      imageUrl = result;
    }

    // 4. Ahora le pasamos el tercer parámetro al Service
    return this.tiendasService.update(+id, updateTiendaDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}
