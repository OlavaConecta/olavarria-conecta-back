import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Importante
import { Repository } from 'typeorm'; // Importante
import { Comercio } from './entities/comercio.entity'; // Tu entidad
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';
import * as bcrypt from 'bcrypt';
import { Tienda } from 'src/tiendas/entities/tienda.entity';

@Injectable()
export class ComerciosService {
  constructor(
    @InjectRepository(Comercio)
    private readonly comercioRepository: Repository<Comercio>, // Inyección del repositorio
    @InjectRepository(Tienda) // <--- AGREGÁ ESTO
    private tiendaRepository: Repository<Tienda>,
  ) { }

  async create(createComercioDto: CreateComercioDto) {
    // 1. Encriptamos la contraseña antes de guardar
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createComercioDto.contrasena, salt);

    // 2. Creamos el objeto con la contraseña hasheada
    const nuevoComercio = this.comercioRepository.create({
      ...createComercioDto,
      id: createComercioDto.tiendaId, // Asignamos el ID de la tienda al comercio
      contrasena: hashPassword,
    });

    // 3. Guardamos en la DB
    const comercioGuardado = await this.comercioRepository.save(nuevoComercio);
    return comercioGuardado;
  }

  async findOneByNombreUsuario(nombreUsuario: string) {
    // Forzamos la búsqueda ignorando cualquier otro estado
    const comercio = await this.comercioRepository.findOne({
      where: { nombreUsuario: nombreUsuario.trim() }
    });
    console.log('Resultado de DB:', comercio ? 'Encontrado' : 'No encontrado');
    return comercio;
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