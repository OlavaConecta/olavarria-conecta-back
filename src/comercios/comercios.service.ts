import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Importante
import { Repository } from 'typeorm'; // Importante
import { Comercio } from './entities/comercio.entity'; // Tu entidad
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';
import * as bcrypt from 'bcrypt';
import { Tienda } from 'src/tiendas/entities/tienda.entity';
import { TiendasService } from 'src/tiendas/tiendas.service';

@Injectable()
export class ComerciosService {
  constructor(
    @InjectRepository(Comercio)
    private readonly comercioRepository: Repository<Comercio>, // Inyección del repositorio
    @InjectRepository(Tienda) // <--- AGREGÁ ESTO
    private tiendaRepository: Repository<Tienda>,
    @InjectRepository(Tienda) // <--- AGREGÁ ESTO
    private readonly tiendasService: TiendasService,
  ) { }

  async create(createComercioDto: CreateComercioDto) {
    console.log('DTO recibido en el registro:', createComercioDto);
    console.log('2. Contraseña pura a hashear:', createComercioDto.contrasena);
    // 1. Encriptamos la contraseña antes de guardar
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createComercioDto.contrasena, salt);
    console.log('3. Hash resultante:', hashPassword);

    // 2. Creamos el objeto con la contraseña hasheada
    const nuevoComercio = this.comercioRepository.create({
      ...createComercioDto,

      contrasena: hashPassword,
      nombreLocal: 'Mi Local', // Valor por defecto para el nombre del local
    });

    // 3. Guardamos en la DB
    const comercioGuardado = await this.comercioRepository.save(nuevoComercio);
    // 4. USAMOS EL SERVICIO DE TIENDAS: 
    // Llamamos al método save() de TiendasService que ya maneja el slug automático y la categoría.
    const nombreTienda =  'Mi Local';

    await this.tiendasService.save({
      nombre: nombreTienda,
      categoria: createComercioDto.categoria, // <--- Aquí pasa la categoría correctamente
      whatsapp: '', 
      direccion: '',
      horario: '',
      imagen: '',
      activo: 0,
      comercioId: comercioGuardado.id,       // <--- Pasa el ID para relacionarlo
      comercio: comercioGuardado
    });

  
    // 5. Retornamos el comercio guardado al final de todo
    return comercioGuardado;
  }


  async findOneByNombreUsuario(nombreUsuario: string) {
    const comercio = await this.comercioRepository.findOne({
      where: { nombreUsuario: nombreUsuario.trim() }
    });

    if (!comercio) return null;

    // Buscamos la tienda usando la relación correcta
    const tienda = await this.tiendaRepository.findOne({
      where: { comercio: { id: comercio.id } }
    });

    // Devolvemos el comercio con la tienda adjunta manualmente
    return {
      ...comercio,
      tienda: tienda || null
    };
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