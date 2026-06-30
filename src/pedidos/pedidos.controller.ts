import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Public()
  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  async findAll() {
    return await this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }
  
  @Get('tienda/:tiendaId')
  findAllByTienda(@Param('tiendaId') tiendaId:number){
    return this.pedidosService.findAllByTienda(tiendaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.pedidosService.remove(+id);
  }
}
