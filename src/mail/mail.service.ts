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
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <h2 style="color: #007bff; font-size: 24px;">🚀 Nuevo mensaje de contacto</h2>
            
            <p style="font-size: 18px; margin: 10px 0;">
              <strong>👤 Nombre:</strong> ${nombre}
            </p>
            
            <p style="font-size: 18px; margin: 10px 0;">
              <strong>🏢 Comercio:</strong> ${nombreLocal}
            </p>
            
            <p style="font-size: 18px; margin: 10px 0;">
              <strong>📞 Teléfono:</strong> ${telefono}
            </p>
            
            <p style="font-size: 18px; margin: 10px 0;">
              <strong>📧 Email:</strong> ${email}
            </p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            
            <p style="font-size: 18px; font-weight: bold;">💬 Mensaje:</p>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 16px; border: 1px solid #e0e0e0;">
              ${mensaje}
            </p>
            
            <p style="font-size: 12px; color: #777; margin-top: 25px;">
              Enviado desde el sistema de Olavarría Conecta
            </p>
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