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
        family:4,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 20000,
        greetingTimeout: 20000
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
