import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { FarmaciaTurno } from './farmacia-turno.entity';

@Entity({ name: 'farmacias' })
export class Farmacia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nombre: string;

    @Column({ length: 255 })
    direccion: string;

    @Column({ length: 50 })
    telefono: string;

    @Column({ name: 'link_maps', length: 255, nullable: true })
    linkMaps: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitud: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitud: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;


    //Relacion OneToMany con FarmaciaTurno
    @OneToMany(() => FarmaciaTurno, (turno) => turno.farmacia)
    turnos: FarmaciaTurno[];
}
