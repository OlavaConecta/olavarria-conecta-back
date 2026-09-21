import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tienda } from './entities/tienda.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService, private readonly cloudinaryService: CloudinaryService) { }

@UseGuards(JwtAuthGuard) // 1. Protegemos la ruta para que exija estar logueado
@Post()
@UseInterceptors(FileInterceptor('imagen_archivo'))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createDto: CreateTiendaDto,
  @Req() req: any // 2. Capturamos la request para obtener los datos del token JWT
) {
  try {
    if (!file) throw new BadRequestException('Falta la imagen');

    // El token JWT nos suele devolver el id o sub del usuario logueado. 
    // (Asegúrate de que en tu estrategia JWT guardes el ID del comercio en req.user.id o req.user.userId)
    const comercioId = req.user.id || req.user.userId; 

    // 1. Subir a Cloudinary
    const imageUrl = await this.cloudinaryService.uploadFile(file);

    // 2. Construir objeto para la DB inyectando el comercioId del usuario logueado
    const datosParaGuardar = {
      ...createDto,
      
      imagen: imageUrl,
      imagenUrl: imageUrl,
      comercioId: comercioId, // <--- 3. Asociamos la tienda automáticamente al comercio autenticado
      activo: true, // Opcional: por defecto activa o en revisión
    };

    // 3. Guardar
    return await this.tiendasService.save(datosParaGuardar);

  } catch (error: any) {
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
    const realId = id.split('-')[0]; // Si viene con guion, tomamos solo la parte numérica
    return this.tiendasService.findOne(+realId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen_archivo')) // 1. Agregamos el interceptor
  async update(
    @Param('id') id: string,
    @Body() updateTiendaDto: UpdateTiendaDto,
    @UploadedFile() file: Express.Multer.File // 2. Capturamos el archivo si viene
  ): Promise<Tienda> {
    const realId = id.split('-')[0];

    let imageUrl: string | undefined = undefined; // Usamos undefined para que el service sepa si hubo cambio o no

    // 3. Si el usuario subió una imagen nueva para editar
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      imageUrl = result;
    }

    // 4. Ahora le pasamos el tercer parámetro al Service
    return this.tiendasService.update(+realId , updateTiendaDto, imageUrl);//verificar si ese pdatetiendadto esta trayendo los datos 
  }

  @UseGuards(JwtAuthGuard)
  @Patch('onboarding/mi-tienda')
  @UseInterceptors(FileInterceptor('imagen_archivo'))
  async actualizarTiendaOnboarding(
    @Req() req: any,
    @Body() updateTiendaDto: UpdateTiendaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const comercioId = req.user.id || req.user.userId;
    
    let imageUrl: string | undefined = undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadFile(file);
    }

    return await this.tiendasService.actualizarTiendaPorComercio(comercioId, updateTiendaDto, imageUrl);
  }

  //Metodo para actualizar el plan de una tienda.

  @UseGuards(JwtAuthGuard)
  @Patch(':id/plan')
async actualizarPlan(
  @Param('id') tiendaId: number,
  @Body('planId') planId: number,
) {
  return this.tiendasService.actualizarPlan(Number(tiendaId), Number(planId));
}
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}
