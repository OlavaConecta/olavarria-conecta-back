import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Agarra el token que viaja en los headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Olavarria_Conecta_2026', // Poné la misma que en el módulo
    });
  }

  async validate(payload: any) {
    // Esto es lo que se va a meter adentro de req.user
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}