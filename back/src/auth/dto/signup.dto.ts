import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;

  @IsString()
  firstName: string; // ← Obligatoire

  @IsOptional()
  @IsString()
  name?: string; // ← Optionnel

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsBoolean()
  is_newbie?: boolean;

  @IsOptional()
  @IsString()
  raisonSociale?: string;

  @IsOptional()
  @IsString()
  siret?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionNames?: string[];

  @IsOptional()
  @IsString()
  address_line_1?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
