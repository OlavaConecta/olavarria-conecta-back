import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>
  ){}
  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    try{
      const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(nuevaCategoria);
    }catch (error){
      console.error("ERROR REAL EN DB:", error);
      throw new InternalServerErrorException('Error al crear categoria');
    }
  }

  async findAll() :Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria | null> {
   const categoria = await this.categoriaRepository.findOneBy({id});
   if (!categoria){
    throw new NotFoundException('Categoria no encontrada');
   } 
   return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if(!categoria){
      throw new NotFoundException('Categoria no encontrada');
    }
    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if(!categoria){
      throw new NotFoundException('Categoria no encontrada');
    }
    await this.categoriaRepository.remove(categoria);
  }
}
