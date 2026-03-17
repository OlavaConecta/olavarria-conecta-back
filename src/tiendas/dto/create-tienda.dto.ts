import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';

export class CreateTiendaDto {
    @IsString() nombre: string;
    @IsString() whatsapp: string;
    @IsString() direccion: string;
    @IsString() horario: string;
    @IsString() categoria: string;

    // 1. IMPORTANTE: Opcional, porque el frontend no envía "imagen", envía "imagen_archivo"
    @IsOptional()
    @IsString()
    imagen?: string;

    // 2. TRANSFORMACIÓN: Convierte el texto "1" a número 1
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    // 3. TRANSFORMACIÓN: Convierte el texto "true" a booleano true
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    activo: boolean;
}