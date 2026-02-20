import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

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

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  address_id: number;
}
