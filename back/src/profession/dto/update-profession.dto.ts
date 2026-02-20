import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionDto } from './create-profession.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfessionDto extends PartialType(CreateProfessionDto) {}
