import { Producto } from "src/productos/entities/producto.entity";
import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
@Entity('comercios')
export class Comercio {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombreUsuario:string;

    @Column()
    contrasena:string;

    @Column()
    nombreLocal:string;

    @Column({default:true})
    isActive:boolean;

    @OneToMany(() => Producto, (producto) => producto.comercio)
productos: Producto[];
}
