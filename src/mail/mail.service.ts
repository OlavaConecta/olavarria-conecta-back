import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import {MailerService} from '@nestjs-modules/mailer';



@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

async enviarContacto(createMailDto: CreateMailDto) {
  const { nombre, nombreLocal, telefono, email, mensaje } = createMailDto;

  try {
    await this.mailerService.sendMail({
      to: 'olavarriaconecta@gmail.com', 
      subject: `Nueva consulta: ${nombreLocal} (${nombre})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">¡Nuevo mensaje desde Olavarría Conecta!</h2>
          <hr />
          <p><strong>Comercio:</strong> ${nombreLocal}</p>
          <p><strong>Responsable:</strong> ${nombre}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0;">
            ${mensaje}
          </div>
          <footer style="font-size: 12px; color: #7f8c8d; margin-top: 20px;">
            Este mensaje fue generado automáticamente por el sistema de Olavarría Conecta.
          </footer>
        </div>
      `,
    });
    
    // 3. Importante: devolvemos un objeto claro para que el front lo lea
    return { status: 'success', message: 'Email enviado correctamente' };
    
  } catch (error) {
    // Esto te permite ver en Railway EXACTAMENTE qué falló si vuelve a dar 500
    console.error("Error en el envío de mail:", error);
    throw error; 
  }
} 
}
