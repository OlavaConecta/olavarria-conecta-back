import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column()
    contrasena:string;
}
