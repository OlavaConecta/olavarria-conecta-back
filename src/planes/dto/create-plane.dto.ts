import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, } from "class-validator";

export class CreatePlaneDto {
    @IsString()
    descripcion:string;

    @IsNumber()
    precio:number;
    
   @IsBoolean()
  @IsOptional() // Opcional si tiene un valor por defecto en la DB
  isMostPop: boolean;

  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del array sea un string
  @IsOptional()
  beneficios: string[];
    
}
