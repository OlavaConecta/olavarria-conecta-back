import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ){}
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const {contrasena, ...datosAdmin} = createAdminDto;

    //generar la sal y encriptar la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const newAdmin= this.adminRepository.create({...datosAdmin, contrasena: hashedPassword});
    return await this.adminRepository.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin | null> {
    const admin= await this.adminRepository.findOneBy( {id});
    if(!admin){
      throw new NotFoundException('Admin no encontrado');
    }
    return admin;
  }

  async findOneByEmail(email: string): Promise<Admin | null> {
  // Esta línea es la que busca en la base de datos de MySQL usando TypeORM
  return await this.adminRepository.findOneBy({ email });
}

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    } 
    Object.assign(admin, updateAdminDto);
    return await this.adminRepository.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    } 
    await this.adminRepository.remove(admin);
  }
}
