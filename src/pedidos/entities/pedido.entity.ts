import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Tienda } from 'src/tiendas/entities/tienda.entity';

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombreCliente:string;

    @Column()
    telefonoCliente:string;

    @Column()
    direccionEntrega:string;

    @Column('decimal',{precision:10,scale:2})
    total:number //esto si o si es necesario para el msj de wsp

    @Column ('json',{nullable:true})
    items: any[]

    @Column({ nullable: true })
    tiendaId: number;

    @ManyToOne(()=>Tienda,(tienda)=>tienda.pedidos)
    @JoinColumn({ name: 'tiendaId' })
    tienda:Tienda
}
//hacer la relacion con tienda.