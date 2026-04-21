import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { Resend } from 'resend';



@Injectable()
export class MailService {
  // Inicializamos Resend con la variable que pusiste en Railway
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async enviarContacto(nombre: string,nombreLocal:string,telefono:string, email: string, mensaje: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Olavarria Conecta <onboarding@resend.dev>', // No cambies este mail todavía
        to: 'olavarriaconecta@gmail.com', // Tu mail donde querés recibir los avisos
        subject: `Mensaje de ${nombre} - Olavarría Conecta`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #007bff;">Nuevo mensaje de contacto</h2>
            <p><strong>De:</strong> ${nombre}</p>
            <p><strong>Comercio:</strong> ${nombreLocal}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr />
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">${mensaje}</p>
          </div>
        `,
      });

      if (error) {
        console.error('Error de Resend:', error);
        return { success: false, error };
      }

      console.log('¡Mail enviado!', data);
      return { success: true };
    } catch (err) {
      console.error('Error inesperado:', err);
      return { success: false };
    }
  }
}