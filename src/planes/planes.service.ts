import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planes } from './entities/plane.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class PlanesService {
  constructor(
    @InjectRepository(Planes)
    private readonly planesRepository: Repository<Planes>
  ) { }

  async create(createPlaneDto: CreatePlaneDto): Promise<Planes> {
    try {
      const nuevoPlan = this.planesRepository.create(createPlaneDto as unknown as Planes);
      return await this.planesRepository.save(nuevoPlan);
    } catch (error) {
      console.error('error al crear plan', error);
      throw new InternalServerErrorException('Error al crear plan');
    }

  }

  async findAll(): Promise<Planes[]> {
    return await this.planesRepository.find();
  }

  async findOne(id: number): Promise<Planes | null> {
    const plan = await this.planesRepository.findOneBy({ id });
    if(!plan){
      throw new NotFoundException('Plan no encontrado');
    }
    return plan;
  }

  async update(id: number, updatePlaneDto: UpdatePlaneDto) {
   const plan = await this.planesRepository.findOne({ where: { id } });;
   if(!plan){
    throw new NotFoundException('Plan no encontrado');
   }
   Object.assign(plan, updatePlaneDto);
   return await this.planesRepository.save(plan);
  }

  async remove(id: number) {
    const plan = await this.planesRepository.findOne({ where: { id } });
    if (!plan){
      throw new NotFoundException('Plan no encontrado');
    }
    await this.planesRepository.remove(plan);
  }
}
