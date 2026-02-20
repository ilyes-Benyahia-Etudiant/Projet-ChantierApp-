import { UpdateAddressDto } from '../../address/dto/update-address.dto';
import {
  IsOptional,
  ValidateNested,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO pour update - on ne liste que les champs modifiables
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsBoolean()
  @IsOptional()
  is_newbie?: boolean;

  @IsString()
  @IsOptional()
  raisonSociale?: string;

  @IsString()
  @IsOptional()
  siret?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}
