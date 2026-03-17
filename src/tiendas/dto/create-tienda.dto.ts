import { Type } from 'class-transformer';
import {IsBoolean, IsNotEmpty, IsNumber,IsString} from 'class-validator'
export class CreateTiendaDto {


    @IsString()
    nombre: string;

    @IsString()
    whatsapp: string;

    @IsString()
    direccion:string;

    @IsString()
    horario:string;

    @IsString()
    imagen?:string;

    @IsBoolean()
    activo:boolean;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @IsString()
    categoria:string;
}
