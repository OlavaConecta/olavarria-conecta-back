import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Le decimos a NestJS que este Guard va a usar la estrategia 'jwt'
export class JwtAuthGuard extends AuthGuard('jwt') {}