import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductoDto {


    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;
    
    @Type(()=> Number)
    @IsNumber()
    precio: number;

    @IsOptional()
    @IsString()
    imagen:string;


    @Type(()=> Number)
    @IsNumber()
    @IsNotEmpty()
    tiendaId: number;

}
