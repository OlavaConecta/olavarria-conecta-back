import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { ComerciosModule } from 'src/comercios/comercios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [AdminModule, ComerciosModule, PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Olavarria_Conecta_2026', // 
      signOptions: { expiresIn: '8h' }, // El token expira en 8 horas
    }),
  ], // Importante para que Auth pueda usar AdminService
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController], 
  exports: [AuthService, PassportModule, JwtModule]
})
export class AuthModule { }