import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // La ruta será http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // La ruta final: http://localhost:3000/auth/login
  async login(@Body() body: { email: string, contrasena: string }) {
    return this.authService.validateUser(body.email, body.contrasena);
  }
}