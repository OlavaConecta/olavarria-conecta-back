import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Farmacia} from "./entities/farmacia.entity";
import {FarmaciaTurno} from "./entities/farmacia-turno.entity";
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';

@Injectable()
export class FarmaciasService {
  constructor(
    @InjectRepository(Farmacia)
    private readonly farmaciaRepository: Repository<Farmacia>,
    @InjectRepository(FarmaciaTurno)
    private readonly turnoRepository: Repository<FarmaciaTurno>,
  ){}

  //Crear la farmacia nueva desde el form
  async create(createFarmaciaDto: CreateFarmaciaDto): Promise <Farmacia> {
    const nuevaFarmacia = this.farmaciaRepository.create(createFarmaciaDto);
    return await this.farmaciaRepository.save(nuevaFarmacia);
  }
   

  async findAll(): Promise<Farmacia[]> {
    return  await this.farmaciaRepository.find({ order: {nombre: 'ASC'} }); // lo ordena alfabeticamente
  }

   findOne(id: number) {
    return `This action returns a #${id} farmacia`;
  }

  async update(id: number, updateFarmaciaDto: UpdateFarmaciaDto) {
  // 1. Actualizamos el registro en la base de datos
  await this.farmaciaRepository.update(id, updateFarmaciaDto);
  
  // 2. Buscamos el registro ya actualizado para devolvérselo a React
  const farmaciaActualizada = await this.farmaciaRepository.findOneBy({ id });
  
  if (!farmaciaActualizada) {
    throw new NotFoundException(`La farmacia con ID ${id} no existe`);
  }
  
  return farmaciaActualizada; 
}

  async remove(id: number): Promise <{message: string}> {
    const farmacia = await this.farmaciaRepository.findOneBy({id});
    if (!farmacia){
      throw new NotFoundException(`La farmacia con ID ${id} no existe`);
    }
    await this.farmaciaRepository.remove(farmacia);
    return {message: `La farmacia  "${farmacia.nombre}" ha sido eliminada exitosamente y todos los turnos asociados a ella tambien`};

  }

  //Asignar un turno a una farmacia
  async createTurno (createTurnoDto: CreateTurnoDto): Promise<FarmaciaTurno> {
    const { farmaciaId, fecha} = createTurnoDto;
    //Se verifica que la farmacia exista
    const farmaciaExiste = await this.farmaciaRepository.findOneBy({id: farmaciaId});
    if (!farmaciaExiste){
      throw new NotFoundException(`No se puede asignar el turno porque la farmacia con ID ${farmaciaId} no existe`);
    }
    try{
      const nuevoTurno= this.turnoRepository.create (createTurnoDto);
      return await this.turnoRepository.save(nuevoTurno);
    } catch (error:any) {
      //Si es error de mysql por la restriccion Unique
      if(error.code === 'ER_DUP_ENTRY' || error.errno === 1062){
      throw new BadRequestException(`Esta farmacia ya tiene asignado un turno para la fecha ${fecha}`
        
      );
    }
    throw error; // Si es otro tipo de error, se lanza para que lo maneje el controlador o el filtro de excepciones global
}
}

// Obtener la farmacia que está de turno HOY
  async findFarmaciaDeTurnoHoy(): Promise<FarmaciaTurno[]> {
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD limpiando la hora
  const hoy = new Date().toISOString().split('T')[0];

  // 🚀 CAMBIO CLAVE: Usamos find() en lugar de findOne() para traer TODOS los del día
  const turnosHoy = await this.turnoRepository.find({
    where: { fecha: hoy },
    relations: ['farmacia'], // Trae también los datos de la farmacia asociada
  });

  // Si el array vuelve vacío, significa que no hay nadie de turno hoy
  if (turnosHoy.length === 0) {
    throw new NotFoundException(`No hay ninguna farmacia de turno asignada para el día de hoy (${hoy}).`);
  }

  return turnosHoy;
}
}