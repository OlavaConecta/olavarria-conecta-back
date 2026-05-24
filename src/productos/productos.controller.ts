import { Controller, Get, Post, Body, Patch, Param, Delete, Query,UseInterceptors, UploadedFile, BadRequestException, Put, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService, private readonly cloudinaryService: CloudinaryService) {}

@Post()
@UseInterceptors(FileInterceptor('imagen_archivo')) 
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createProductoDto: CreateProductoDto, 
) {
  console.log('Archivo recibido en el controlador:', file);
  return await this.productosService.create(createProductoDto, file);
}

  @Get()
  findAll(@Query('tiendaId')tiendaId:string) {
    if(tiendaId){
      const realId = tiendaId.split('-')[0]; // Si viene con guion, tomamos solo la parte numérica
      const numericId = +realId

      if (isNaN(numericId)) {
        throw new BadRequestException('El parámetro tiendaId debe ser un número válido');
      }
      return this.productosService.findAllByTienda(numericId);
    }
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen_archivo'))
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto, @UploadedFile() file: Express.Multer.File) {
    return this.productosService.update(+id, updateProductoDto, file);
  }
  
  @UseGuards(AuthGuard('jwt')) // 🔒 Frena a cualquiera que no tenga el token (incógnito, extraños, etc.)
  @Patch('dashboard/:id')
  async updateParcial(
    @Param('id') id: string, 
    @Body() updateProductoDto: UpdateProductoDto,
    @Req() req: any // 👈 Traemos la request para saber quién es el usuario logueado
  ) {
    // 1. Buscamos el producto primero para saber a qué comercio le pertenece
    const producto = await this.productosService.findOne(+id);
    
    if (!producto) {
      throw new UnauthorizedException('El producto que intentas editar no existe');
    }

    // 2. Extraemos el ID del comercio desde el Token seguro (JwtStrategy)
    const comercioLogueadoId = req.user?.userId || req.user?.id || req.user?.sub;

    // 3. Control de seguridad: ¿El producto pertenece al comercio que está logueado?
    // (Ajustá "producto.comercioId" según cómo se llame la columna de relación en tu entidad Producto)
    if (producto.comercioId !== comercioLogueadoId) {
      throw new UnauthorizedException('No tienes permisos para modificar productos de otro comercio');
    }

    // 4. Si pasó el control, guardamos en la DB
    return this.productosService.update(+id, updateProductoDto, undefined as any);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
