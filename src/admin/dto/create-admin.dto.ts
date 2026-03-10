import { IsString } from "class-validator";

export class CreateAdminDto {

    @IsString()
    email:string;
    
    @IsString()
    contrasena:string;

}
