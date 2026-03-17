import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
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
  if (!file) {
    throw new BadRequestException('No se recibió la imagen (campo imagen_archivo)');
  }

  // 1. Subir a Cloudinary
  // Como tu error dice que secure_url no existe en 'string', 
  // significa que imageUrl YA es el string de la URL.
  const imageUrl = await this.cloudinaryService.uploadFile(file);

  // 2. Combinar datos
  // Tu error dice que el objeto REQUIERE 'imagenUrl' y 'imagen'
  const datosCompletos = {
    ...createDto,
    imagen: imageUrl,    // El string de la URL
    imagenUrl: imageUrl  // También lo pide como imagenUrl según el error
  };

  // 3. Guardar en DB
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
