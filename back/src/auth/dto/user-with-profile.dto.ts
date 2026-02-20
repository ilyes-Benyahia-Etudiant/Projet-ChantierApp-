import { Role } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

@Exclude()
export class UserWithProfileDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  @Transform(({ obj }) => {
    if (
      obj.profiles &&
      Array.isArray(obj.profiles) &&
      obj.profiles.length > 0
    ) {
      return plainToInstance(ProfileResponseDto, obj.profiles[0], {
        excludeExtraneousValues: true,
      });
    }
    return undefined;
  })
  profile: ProfileResponseDto;
}
