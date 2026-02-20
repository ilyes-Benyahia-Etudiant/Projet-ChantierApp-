import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileHasProfessionDto } from './create-profile_has_profession.dto';

export class UpdateProfileHasProfessionDto extends PartialType(
  CreateProfileHasProfessionDto,
) {}
