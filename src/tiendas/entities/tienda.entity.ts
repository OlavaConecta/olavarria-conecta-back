import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Planes } from 'src/planes/entities/plane.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tiendas')

export class Tienda {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    whatsapp: string;

    @Column()
    direccion: string;

    @Column()
    horario: string;

    @Column({type: 'longtext', nullable: true})
    imagen: string;

    @Column()
    activo: boolean;
    ;
    @Column({ name: 'categoria', type: 'varchar', nullable: true }) // Esto lee el texto "Mascotas", "Peluquería", etc.
    categoria: string;

    @ManyToOne(() => Planes, (plan) => plan.tiendas)
    @JoinColumn({ name: 'planId' })
    plan: Planes;


    @OneToMany(() => Producto, (producto) => producto.tienda)
    productos: Producto[];
}

//falta los one to many con productos y categorias
