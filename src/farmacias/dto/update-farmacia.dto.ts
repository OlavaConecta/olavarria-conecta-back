import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmaciaDto } from './create-farmacia.dto';

export class UpdateFarmaciaDto extends PartialType(CreateFarmaciaDto) {}
