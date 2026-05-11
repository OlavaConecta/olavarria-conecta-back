import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Importante
import { Repository } from 'typeorm'; // Importante
import { Comercio } from './entities/comercio.entity'; // Tu entidad
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ComerciosService {
  constructor(
    @InjectRepository(Comercio)
    private readonly comercioRepository: Repository<Comercio>, // Inyección del repositorio
  ) {}

  async create(createComercioDto: CreateComercioDto) {
    // 1. Encriptamos la contraseña antes de guardar
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createComercioDto.contrasena, salt);

    // 2. Creamos el objeto con la contraseña hasheada
    const nuevoComercio = this.comercioRepository.create({
      ...createComercioDto,
      contrasena: hashPassword,
    });

    // 3. Guardamos en la DB
    return await this.comercioRepository.save(nuevoComercio);
  }

  async findOneByNombreUsuario(nombreUsuario: string) {
  // Ahora TypeORM reconocerá 'nombreUsuario' porque existe en la Entidad
  return await this.comercioRepository.findOne({ 
    where: { nombreUsuario: nombreUsuario } 
  });
}

  findAll() {
    return this.comercioRepository.find();
  }

  async findOne(id: number) {
    return await this.comercioRepository.findOne({ where: { id } });
  }

  async update(id: number, updateComercioDto: UpdateComercioDto) {
    // Si en el update viene una contraseña nueva, también habría que hashearla aquí
    return await this.comercioRepository.update(id, updateComercioDto);
  }

  async remove(id: number) {
    return await this.comercioRepository.delete(id);
  }
}