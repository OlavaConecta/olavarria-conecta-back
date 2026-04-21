import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        connectionTimeout: 10000, // 10 segundos de espera
        greetingTimeout: 20000,
        socketTimeout: 20000,
        dnsV_4: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
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
