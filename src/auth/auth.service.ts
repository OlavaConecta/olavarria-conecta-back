import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

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
}
