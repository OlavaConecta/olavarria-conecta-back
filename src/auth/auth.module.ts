import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { ComerciosModule } from 'src/comercios/comercios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [AdminModule, ComerciosModule,
    PassportModule,
    JwtModule.register({
      secret: 'OLAVARRIA_CONECTA_2026', // Cambiala por una frase segura
      signOptions: { expiresIn: '8h' }, // El token dura un día enteros
    }),
  ],
   // Importante para que Auth pueda usar AdminService
  providers: [AuthService, JwtStrategy], // Registramos la estrategia JWT
  controllers: [AuthController], 

})
export class AuthModule { }