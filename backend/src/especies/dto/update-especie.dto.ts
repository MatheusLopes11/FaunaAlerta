import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecieDto } from './create-especie.dto.js';

export class UpdateEspecieDto extends PartialType(CreateEspecieDto) {}