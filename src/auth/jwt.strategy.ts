import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Le indica a NestJS que extraiga el token del header 'Authorization: Bearer <TOKEN>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'OLAVARRIA_CONECTA_2026', // Debe ser la misma clave del AuthModule
    });
  }

  async validate(payload: any) {
    // Los datos que devuelvas acá se inyectan en las peticiones como 'req.user'
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}