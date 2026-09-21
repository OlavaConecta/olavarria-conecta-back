import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { ComerciosService } from 'src/comercios/comercios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly comerciosService: ComerciosService,
    private readonly jwtService: JwtService
  ) { }
  async login(user: any, type: 'admin' | 'comercio') {
    console.log("👀 OBJETO USER QUE LLEGA AL LOGIN:", user);
    const payload = {
      sub: user.id,
      email: user.email || user.nombreUsuario,
      roles: [type]
    };

    // Evaluamos si necesita onboarding solo si es un comercio y tiene una tienda con nombre por defecto
    let necesitaOnboarding = false;
    if (type === 'comercio') {
      // Una tienda está completa si existe, su nombre NO es genérico y tiene dirección cargada.
      const tieneTiendaValida = user.tienda && 
                                user.tienda.nombre && 
                                user.tienda.nombre.trim() !== '' && 
                                user.tienda.nombre !== 'Mi Local' && 
                                user.tienda.direccion;
      const esUsuarioAntiguo = user.nombreLocal && 
                               user.nombreLocal.trim() !== '' && 
                               user.nombreLocal !== 'Mi Local';
                        
      // Si la tienda NO es válida/completa, entonces SÍ necesita onboarding
      necesitaOnboarding = !(tieneTiendaValida || esUsuarioAntiguo);
    }
    return {
      id: user.id,
      email: user.email || user.nombreUsuario,
      role: type,
      necesitaOnboarding: necesitaOnboarding,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, contrasena: string): Promise<any> {
    console.log('datos que llegan del front', email, contrasena);
    // 1. Buscamos al admin por email
    const admin = await this.adminService.findOneByEmail(email);
    //2 ver que trajo la db
    console.log('admin encontrado en la DB', admin);
    if (!admin) {
      console.log('admin no encontrado', admin)
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
    console.log('¿La contraseña coincide?', isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 3. Devolvemos el comercio sin la pass
    const { contrasena: _, ...result } = comercio;
    return result;
  }

  // Fíjate que eliminé 'email: string;' de los parámetros
async registrarComercio(body: {
    nombreUsuario: string;
    contrasena: string
  }) {
  
    
    // Directamente le pasamos los datos en texto plano al servicio de comercios
    const nuevoComercio = await this.comerciosService.create({
      nombreUsuario: body.nombreUsuario,
      contrasena: body.contrasena,

  
    });

    // Devolvemos el resultado sin la contraseña
    const { contrasena: _, ...result } = nuevoComercio;
    return result;
  }
}
