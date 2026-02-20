import { Injectable } from '@nestjs/common';
import { CreateProfileHasProfessionDto } from './dto/create-profile_has_profession.dto';
import { UpdateProfileHasProfessionDto } from './dto/update-profile_has_profession.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProfileHasProfession } from './entities/profile_has_profession.entity';

@Injectable()
export class ProfileHasProfessionService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProfileHasProfessionDto: CreateProfileHasProfessionDto,
  ): Promise<ProfileHasProfession> {
    return this.prisma.profileHasProfession.create({
      data: {
        profile_id: createProfileHasProfessionDto.profile_id,
        profession_id: createProfileHasProfessionDto.profession_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(
    options?: Prisma.ProfileHasProfessionFindManyArgs,
  ): Promise<ProfileHasProfession[]> {
    return this.prisma.profileHasProfession.findMany(options);
  }

  async findOne(id: number): Promise<ProfileHasProfession | null> {
    return this.prisma.profileHasProfession.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: UpdateProfileHasProfessionDto,
  ): Promise<ProfileHasProfession> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.profileHasProfession.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<ProfileHasProfession> {
    return await this.prisma.profileHasProfession.delete({ where: { id } });
  }
}
