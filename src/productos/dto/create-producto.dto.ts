import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductoDto {


    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;
    
    @IsNumber()
    precio: number;

    @IsString()
    imagen:string;

    @IsNumber()
    @IsNotEmpty()
    tiendaId: number;

}
