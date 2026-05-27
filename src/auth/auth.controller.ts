import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // La ruta será http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // La ruta final: http://localhost:3000/auth/login
  async login(@Body() body: { email: string, contrasena: string }) {
    const user = await this.authService.validateUser(body.email, body.contrasena);
    return this.authService.login(user, 'admin');
  }

  // --- LOGIN PARA COMERCIOS (Tecnomanía y otros) ---
  @Post('login-comercio') // Ruta: http://localhost:3000/auth/login-comercio
  async loginComercio(@Body() body: { nombreUsuario: string, contrasena: string }) {
    const comercio = await this.authService.validateComercio(body.nombreUsuario, body.contrasena);
    return this.authService.login(comercio, 'comercio');
  }
}