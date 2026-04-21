import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import {MailerModule} from '@nestjs-modules/mailer';

@Module({
  imports:[
    MailerModule.forRoot({
      transport :{
        host:'smtp.gmail.com',
        auth:{
          user:'olavarriaconecta@gmail.com',
        pass:'obvczmsfcaanehnv',
        },
},
      defaults:{
        from: 'Olavarria Conecta <no-reply@olavarriaconecta.com>',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
