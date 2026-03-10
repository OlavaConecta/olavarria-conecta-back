import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column({ type: 'varchar', length: 255 })
    contrasena:string;
}
