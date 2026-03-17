import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // <--- IMPORTANTE

export class CreateTiendaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    whatsapp: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    horario: string;

    // Cambiamos a IsOptional porque la imagen la maneja el Interceptor, 
    // y el DTO a veces se queja si el archivo no es un string.
    @IsString()
    @IsOptional()
    imagen?: string;

    @Type(() => Boolean) // <--- Fuerza la conversión a Booleano
    @IsBoolean()
    activo: boolean;

    @Type(() => Number)  // <--- Fuerza la conversión a Número
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @IsString()
    @IsNotEmpty()
    categoria: string;
}