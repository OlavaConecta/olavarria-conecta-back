import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmacia } from "./entities/farmacia.entity";
import { FarmaciaTurno } from "./entities/farmacia-turno.entity";
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
  ) { }

  //Crear la farmacia nueva desde el form
  async create(createFarmaciaDto: CreateFarmaciaDto): Promise<Farmacia> {
    const nuevaFarmacia = this.farmaciaRepository.create(createFarmaciaDto);
    return await this.farmaciaRepository.save(nuevaFarmacia);
  }


  async findAll(): Promise<Farmacia[]> {
    return await this.farmaciaRepository.find({ order: { nombre: 'ASC' } }); // lo ordena alfabeticamente
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

  async remove(id: number): Promise<{ message: string }> {
    const farmacia = await this.farmaciaRepository.findOneBy({ id });
    if (!farmacia) {
      throw new NotFoundException(`La farmacia con ID ${id} no existe`);
    }
    await this.farmaciaRepository.remove(farmacia);
    return { message: `La farmacia  "${farmacia.nombre}" ha sido eliminada exitosamente y todos los turnos asociados a ella tambien` };

  }

  //Asignar un turno a una farmacia
  async createTurno(createTurnoDto: CreateTurnoDto): Promise<FarmaciaTurno> {
    const { farmaciaId, fecha } = createTurnoDto;
    //Se verifica que la farmacia exista
    const farmaciaExiste = await this.farmaciaRepository.findOneBy({ id: farmaciaId });
    if (!farmaciaExiste) {
      throw new NotFoundException(`No se puede asignar el turno porque la farmacia con ID ${farmaciaId} no existe`);
    }
    try {
      const nuevoTurno = this.turnoRepository.create(createTurnoDto);
      return await this.turnoRepository.save(nuevoTurno);
    } catch (error: any) {
      //Si es error de mysql por la restriccion Unique
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException(`Esta farmacia ya tiene asignado un turno para la fecha ${fecha}`

        );
      }
      throw error; // Si es otro tipo de error, se lanza para que lo maneje el controlador o el filtro de excepciones global
    }
  }

  // Obtener la farmacia que está de turno HOY (Manejando el corte de las 8 AM)
  async findFarmaciaDeTurnoHoy(): Promise<FarmaciaTurno[]> {
    // 1. Obtenemos la fecha y hora actual en el servidor
    const ahora = new Date();

    // 2. Sacamos la hora actual (de 0 a 23)
    const horaActual = ahora.getHours();

    // 3. Creamos una copia de la fecha para poder manipularla si hace falta
    const fechaBuscar = new Date(ahora);

    // 4. Si son entre las 00:00 y las 07:59 AM, restamos 1 día
    if (horaActual >= 0 && horaActual < 8) {
      fechaBuscar.setDate(ahora.getDate() - 1);
    }

    // 5. Formateamos la fecha a YYYY-MM-DD para MySQL
    const anio = fechaBuscar.getFullYear();
    const mes = String(fechaBuscar.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaBuscar.getDate()).padStart(2, '0');

    const fechaFormateada = `${anio}-${mes}-${dia}`;

    // 6. Buscamos en la base de datos usando nuestra fecha calculada
    const turnosHoy = await this.turnoRepository.find({
      where: { fecha: fechaFormateada },
      relations: ['farmacia'],
    });

    // Si el array vuelve vacío
    if (turnosHoy.length === 0) {
      throw new NotFoundException(`No hay ninguna farmacia de turno asignada para el día (${fechaFormateada}).`);
    }

    return turnosHoy;
  }
}