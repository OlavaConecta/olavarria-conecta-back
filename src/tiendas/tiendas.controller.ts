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
@Post()
@UseInterceptors(FileInterceptor('imagen_archivo'))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createDto: CreateTiendaDto
) {
  try {
    if (!file) throw new BadRequestException('Falta la imagen');

    // 1. Subir a Cloudinary
    const imageUrl = await this.cloudinaryService.uploadFile(file);
    console.log('URL de imagen generada:', imageUrl);

    // 2. Construir objeto para la DB
    const datosParaGuardar = {
      ...createDto,
      planId: Number(createDto.planId), // Forzamos número por si llega string
      imagen: imageUrl,
      imagenUrl: imageUrl,
    };

    console.log('Intentando guardar en DB:', datosParaGuardar);

    // 3. Guardar
    return await this.tiendasService.save(datosParaGuardar);

  } catch (error) {
    // ESTO VA A APARECER EN LOS LOGS DE RAILWAY
    console.error('ERROR CRÍTICO EN CREATE:', error.message);
    throw error; 
  }
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
