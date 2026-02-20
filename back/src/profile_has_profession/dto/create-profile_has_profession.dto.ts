import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProfileHasProfessionDto {
  @IsInt()
  @IsNotEmpty()
  profile_id: number;

  @IsInt()
  @IsNotEmpty()
  profession_id: number;
}
