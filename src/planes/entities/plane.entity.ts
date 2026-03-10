import { Tienda } from "src/tiendas/entities/tienda.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Planes {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    descripcion:string;

    @Column('decimal')
    precio:number;

    @Column({ default: false })
    isMostPop: boolean;

    @Column("simple-array", { nullable: true })
    beneficios: string[];

    @OneToMany(()=>Tienda,(tienda)=>tienda.plan)
    tiendas:Tienda[];

}
