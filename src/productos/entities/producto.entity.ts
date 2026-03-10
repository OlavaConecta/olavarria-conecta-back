import { Tienda } from "src/tiendas/entities/tienda.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";


@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'longtext', nullable: true })
    imagen: string;

    @ManyToOne(()=>Tienda, (tienda)=>tienda.productos)
    @JoinColumn({ name: 'tiendaId' })   
    tienda: Tienda;

}
