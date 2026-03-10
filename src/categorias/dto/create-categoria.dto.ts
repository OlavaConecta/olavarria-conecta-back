import { IsString } from "class-validator";

export class CreateCategoriaDto {

@IsString()
nombre: string;

@IsString()
icono: string;
}
