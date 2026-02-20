import { Profession } from './../../profession/entities/profession.entity';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { AddressResponseDTO } from '../../address/dto/address-response.dto';
import { ProfileHasProfession } from '@prisma/client';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  firstName: string;

  @Expose()
  telephone?: string;

  @Expose()
  is_newbie?: boolean;

  @Expose()
  raisonSociale?: string;

  @Expose()
  siret?: string;

  @Expose()
  user_id: number;

  @Expose()
  @Type(() => AddressResponseDTO)
  address?: AddressResponseDTO;

  //TODO: typer correctement le retour
  @Expose()
  @Transform(({ obj }) => {
    if (obj.skills && Array.isArray(obj.skills)) {
      return obj.skills.map(
        (skill: any) => skill.profession?.profession_name ?? '',
      );
    }
    return [];
  })
  professions?: string[];
}
