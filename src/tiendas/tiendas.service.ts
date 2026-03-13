import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { Tienda } from './entities/tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TiendasService {

  constructor(
    @InjectRepository(Tienda) private readonly tiendaRepository: Repository<Tienda>
  ){}

  async create(createTiendaDto: CreateTiendaDto, imagenUrl: string): Promise<Tienda> {
    try {
      const {planId,...datosTienda} = createTiendaDto;
      const tienda = this.tiendaRepository.create({...datosTienda,plan:{id:planId},imagen:imagenUrl});
      return await this.tiendaRepository.save(tienda);
    } catch (error) {
      throw new Error(`Error creating tienda: ${error.message}`);
    }
  }

  async findAll(): Promise <Tienda[]> {
    return this.tiendaRepository.find({
      relations: ['plan', 'productos']
    });
  }

  async findOne(id: number) :Promise <Tienda | null>{
   const tienda = await this.tiendaRepository.findOneBy({id});
   if (!tienda) {
    throw new NotFoundException(`Tienda with id ${id} not found`);
   }
   return tienda;
  }

async update(id: number, updateTiendaDto: UpdateTiendaDto,imagenUrl?:string) {
  
  const tienda = await this.tiendaRepository.findOne({ where: { id } });
  
  if (!tienda) {
    throw new NotFoundException('Tienda no encontrada');
  }

  // 2. DESESTRUCTURAMOS: Separamos los campos especiales de los simples
  const { planId, categoria, ...datosSimples } = updateTiendaDto;

  // 3. ACTUALIZAMOS DATOS SIMPLES (Nombre, WhatsApp, Dirección, Horario, Imagen, Activo)
  Object.assign(tienda, datosSimples);

  if(imagenUrl){
    tienda.imagen = imagenUrl;
  }

  // 4. FORZAMOS LA CATEGORÍA (El texto: "Mascotas" -> "Restaurant")
  // Como en la Entity es un @Column() simple, lo asignamos directo
  if (categoria !== undefined) {
    tienda.categoria = categoria;
  }

  // 5. FORZAMOS EL PLAN (La relación ManyToOne)
  // Usamos el planId que viene del DTO para vincular el objeto
  if (planId !== undefined) {
    tienda.plan = { id: Number(planId) } as any;
  }

  // 6. GUARDAMOS TODO
  // save() detectará que 'categoria' cambió y disparará el UPDATE en la tabla
  return await this.tiendaRepository.save(tienda);
}

  async remove(id: number) {
    const tienda = await this.tiendaRepository.findOne({where:{id}});
    if (!tienda){
      throw new NotFoundException('tienda no encontrada');
    }
    await this.tiendaRepository.remove(tienda);
  
}
}
