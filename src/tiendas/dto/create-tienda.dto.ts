import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";
import { Type } from 'class-transformer';

export class CreateTiendaDto {
    @IsString() nombre: string;
    @IsString() whatsapp: string;
    @IsString() direccion: string;
    @IsString() horario: string;
    @IsString() categoria: string;

    @IsOptional() // Permitimos que venga vacío porque la URL la pone el Service
    @IsString() 
    imagen?: string;

    @Type(() => Number) // Esto convierte el "1" que manda el FormData en un 1 real
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    // Usamos string o opcional para "activo" porque MySQL lo tiene como '1'
    @IsOptional()
    activo?: any;
}