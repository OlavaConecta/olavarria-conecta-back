import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from 'typeorm';
import {Farmacia} from './farmacia.entity';
@Entity({ name: 'farmacias_turnos' })
@Unique('turno_unico',['farmaciaId', 'fecha'])
export class FarmaciaTurno {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'farmacia_id'})
    farmaciaId:number;

    @Column({type:'date'})
    fecha: string; //se maneja en formato 'YYYY-MM-DD'

    @ManyToOne(()=> Farmacia, (farmacia)=> farmacia.turnos, {onDelete:'CASCADE'})
    @JoinColumn({name:'farmacia_id'})
    farmacia:Farmacia;
}