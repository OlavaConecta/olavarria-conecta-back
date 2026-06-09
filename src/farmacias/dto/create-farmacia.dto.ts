import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateFarmaciaDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    nombre:string;

    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    @IsString({ message: 'La direccion debe ser un texto' })
    direccion:string;

    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @IsString({ message: 'El teléfono debe ser un texto' })
    telefono:string;

    @IsOptional()
    @IsString({ message: 'El link de maps debe ser un texto' })
    linkMaps?:string;

    @IsOptional()
    @IsNumber({}, { message: 'La latitud debe ser un número' })
    latitud?:number;

    @IsOptional()
    @IsNumber({}, { message: 'La longitud debe ser un número' })
    longitud?:number;


} 