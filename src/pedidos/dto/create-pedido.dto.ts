import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString,IsArray} from "class-validator";
export class CreatePedidoDto {
    
    @Type(()=> Number)
    @IsNumber()
    @IsNotEmpty()
    tiendaId:number;

    @IsString()
    @IsNotEmpty()
    nombreCliente:string;

    @IsString()
    @IsNotEmpty()
    telefonoCliente:string;

    @IsNumber()
    necesitaEnvio:number;

    @IsString()
    @IsNotEmpty()
    direccionEntrega:string;

    @IsNumber()
    @IsNotEmpty()
    total:number;

    @IsArray()
    items:any[];

}
