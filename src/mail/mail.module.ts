import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: '74.125.142.108',
        port: 587,
        secure: false,
        family: 4,
        connectionTimeout: 20000, // 10 segundos de espera
        greetingTimeout: 20000,
        socketTimeout: 20000,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          servername: 'smtp.gmail.com',
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `Olavarria Conecta <${process.env.MAIL_USER}>`,
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
