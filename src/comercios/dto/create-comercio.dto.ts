import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateComercioDto {
    @IsString()
    @IsNotEmpty()
    nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contrasena: string;

    @IsString()
    @IsNotEmpty()
    nombreLocal: string;
}
