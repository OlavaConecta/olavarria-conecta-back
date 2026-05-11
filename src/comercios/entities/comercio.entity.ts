import { Producto } from "src/productos/entities/producto.entity";
import { Tienda } from "src/tiendas/entities/tienda.entity";
import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
@Entity('comercios')
export class Comercio {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'nombreUsuario'})
    nombreUsuario:string;

    @Column({name:'contrasena'})
    contrasena:string;

    @Column()
    nombreLocal:string;

    @Column({default:true})
    isActive:boolean;
   
    @OneToMany(() => Tienda, (tienda) => tienda.comercio)
tiendas: Tienda[];


}
