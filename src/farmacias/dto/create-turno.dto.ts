import {IsNotEmpty, IsInt, IsString, Matches} from "class-validator";

export class CreateTurnoDto {
    @IsNotEmpty({ message: 'el ID de la farmacia es obligatoria' })
    @IsInt({ message: 'el ID de la farmacia debe ser un número entero' })
    farmaciaId: number;

    @IsNotEmpty({ message: 'la fecha es obligatoria' })
    @IsString({ message: 'la fecha debe ser un texto' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'la fecha debe tener el formato YYYY-MM-DD' })
    fecha: string;
}