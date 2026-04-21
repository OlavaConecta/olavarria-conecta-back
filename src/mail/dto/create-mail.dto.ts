import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
    nombre:string;

    nombreLocal:string;
    @IsString()
    @IsNotEmpty()
    telefono:string;
    
    email:string;
    
    mensaje:string;
}
