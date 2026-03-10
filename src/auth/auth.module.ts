import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AdminModule], // Importante para que Auth pueda usar AdminService
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}