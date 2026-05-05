import { Controller, Get, Post, Body, Patch, Param, Delete, Query,UseInterceptors, UploadedFile, BadRequestException, Put } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
