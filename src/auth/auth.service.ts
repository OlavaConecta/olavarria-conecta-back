import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { ComerciosService } from 'src/comercios/comercios.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  jwtService: any;
  constructor(
    private readonly adminService: AdminService,
    private readonly comerciosService: ComerciosService  ) {}

  async validateUser(email: string, contrasena: string): Promise<any> {
    console.log('datos que llegan del front', email, contrasena);
    // 1. Buscamos al admin por email
    const admin = await this.adminService.findOneByEmail(email);
    //2 ver que trajo la db
    console.log('admin encontrado en la DB', admin);
    if (!admin) {
        console.log('admin no encontrado',admin)
      throw new UnauthorizedException('El email no existe');
    }

    // 2. Comparamos la contraseña plana con el hash de la DB
    const isMatch = await bcrypt.compare(contrasena, admin.contrasena);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 3. Si todo está bien, devolvemos el admin (sin la contraseña)
    const { contrasena: _, ...result } = admin;
    return result;
  }
  // --- VALIDACIÓN DE COMERCIO (Nueva para Tecnomanía y otros) ---
  async validateComercio(nombreUsuario: string, contrasena: string): Promise<any> {
    console.log('Login Comercio:', nombreUsuario);

    // 1. Buscamos por nombre de usuario en lugar de email
    const comercio = await this.comerciosService.findOneByNombreUsuario(nombreUsuario);
    
    if (!comercio) {
      throw new UnauthorizedException('El nombre de usuario no existe');
    }

    // 2. Comparamos con bcrypt
    const isMatch = await bcrypt.compare(contrasena, comercio.contrasena);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 3. Devolvemos el comercio sin la pass
    const { contrasena: _, ...result } = comercio;
    return result;
  
  }
  async loginComercio(nombreUsuario: string, contrasena: string) {
    // Primero corre tu validación de arriba para verificar que la contraseña sea correcta
    const comercioValido = await this.validateComercio(nombreUsuario, contrasena);

    // Si pasó la validación, armamos el Payload (los datos que van ocultos dentro del token)
    const payload = { 
      sub: comercioValido.id, 
      username: comercioValido.nombreUsuario 
    };

    // Devolvemos los datos que React necesita + el maldito Token firmado
    return {
      id: comercioValido.id,
      nombreUsuario: comercioValido.nombreUsuario,
      nombreLocal: comercioValido.nombreLocal,
      isActive: comercioValido.isActive,
      // Generamos el string JWT en base al payload y la secret del AuthModule
      token: this.jwtService.sign(payload), 
    };}
  
}
