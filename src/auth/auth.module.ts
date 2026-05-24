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
  ], // Importante para que Auth pueda usar AdminService
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController], 

})
export class AuthModule { }