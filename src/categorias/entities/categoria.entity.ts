import { Tienda } from "src/tiendas/entities/tienda.entity";
import { Column, Entity, JoinColumn, PrimaryColumn,ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column({type:'text'})
    icono:string;

//Muchas Categorias pertenecen a una tienda.

@ManyToOne(()=> Tienda,(tienda)=>tienda.categoria)
@JoinColumn({name:'tiendaId'})
tienda:Tienda;

}
