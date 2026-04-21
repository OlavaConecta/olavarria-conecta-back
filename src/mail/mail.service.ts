import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import {MailerService} from '@nestjs-modules/mailer';



@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarContacto(createMailDto: CreateMailDto) {
    const { nombre, email, mensaje } = createMailDto;

    await this.mailerService.sendMail({
      to: 'tu-mail-donde-recibis-consultas@gmail.com',
      subject: `Nueva consulta de ${nombre} - Olavarría Conecta`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>¡Nuevo mensaje desde la web!</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${mensaje}</p>
        </div>
      `,
    });
    
    return { status: 'success', message: 'Email enviado correctamente' };
  }
}
