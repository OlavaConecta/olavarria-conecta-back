import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';

export class CreateTiendaDto {
    @IsString()
    nombre: string;

    @IsString()
    whatsapp: string;

    @IsString()
    direccion: string;

    @IsString()
    horario: string;

    @IsString()
    categoria: string;

    // ESTO ES CLAVE: En el DTO de productos te funciona, pero aquí
    // lo ponemos opcional para que NestJS no lo pida en el JSON del Body.
    @IsOptional()
    @IsString()
    imagen?: string;

    // Usamos Type para que el string "1" de FormData pase a ser el número 1
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @IsOptional() // Por si no lo mandás, que no rompa
    @IsBoolean()
    @Type(() => Boolean)
    activo: boolean;
}
