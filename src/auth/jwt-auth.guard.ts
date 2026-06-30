import { Injectable, ExecutionContext} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {IS_PUBLIC_KEY} from './public.decorator'


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Buscamos si la ruta o el controlador tienen el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 2. Si es pública, permitimos el acceso saltando la validación JWT
    if (isPublic) {
      return true;
    }
    
    // 3. Si no es pública, realizamos la validación normal
    return super.canActivate(context);
  }
}