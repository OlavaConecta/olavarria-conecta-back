import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('enviar')
  async enviarContacto(@Body() createMailDto: CreateMailDto) {
    return await this.mailService.enviarContacto(
      createMailDto.nombre,
      createMailDto.nombreLocal,
      createMailDto.telefono,
      createMailDto.email,
      createMailDto.mensaje
    );
  }
}
