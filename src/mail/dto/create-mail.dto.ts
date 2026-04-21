import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    nombreLocal: string;
    
    @IsString()
    @IsNotEmpty()
    telefono: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    mensaje: string;
}
