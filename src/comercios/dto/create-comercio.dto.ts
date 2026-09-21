import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, IsNumber, IsOptional } from 'class-validator';

export class CreateComercioDto {
    @IsString()
    @IsNotEmpty()
    nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contrasena: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number) // Asegura que el valor se transforme a número
    tiendaId?:number;

    
    @IsString() // <--- Agregas esto al DTO del comercio para que la reciba del front
    @IsOptional() 
    categoria?: string;
}
