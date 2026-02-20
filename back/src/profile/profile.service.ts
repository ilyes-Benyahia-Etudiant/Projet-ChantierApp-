import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Vérifier si le siret existe déjà (s'il est fourni)
    if (createProfileDto.siret) {
      const existingSiret = await this.prisma.profile.findUnique({
        where: { siret: createProfileDto.siret },
      });
      if (existingSiret) {
        throw new ConflictException(
          `Un profile avec le SIRET ${createProfileDto.siret} existe déjà`,
        );
      }
    }

    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.ProfileFindManyArgs): Promise<Profile[]> {
    return this.prisma.profile.findMany(options);
  }

  async findOne(id: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateProfileDto): Promise<Profile> {
    // Vérifier si le siret existe déjà (s'il est fourni et différent de l'actuel)
    if (data.siret) {
      const existingSiret = await this.prisma.profile.findUnique({
        where: { siret: data.siret },
      });
      if (existingSiret && existingSiret.id !== id) {
        throw new ConflictException(
          `Un profile avec le SIRET ${data.siret} existe déjà`,
        );
      }
    }

    // Extraire l'address des données de profile
    const { address, ...profileData } = data;

    // Si une address est fournie, la mettre à jour
    if (address) {
      const profile = await this.prisma.profile.findUnique({ where: { id } });
      if (profile && profile.address_id) {
        await this.prisma.address.update({
          where: { id: profile.address_id },
          data: {
            ...address,
            updated_at: new Date(),
          },
        });
      }
    }

    // Mettre à jour le profile
    const updateData = {
      ...profileData,
      updated_at: new Date(),
    };
    return await this.prisma.profile.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.profile.delete({ where: { id } });
    return true;
  }

  async getProfessions(profileId: number) {
    const profileWithProfessions = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        skills: {
          include: {
            profession: true,
          },
        },
      },
    });

    if (!profileWithProfessions) {
      return null;
    }
    // Retourne uniquement le tableau des professions
    return profileWithProfessions.skills.map((skill) => skill.profession);
  }

  async addProfessions(profileId: number, professionIds: number[]) {
    // Créer les liens dans la table associative pour chaque profession
    const createPromises = professionIds.map((professionId) =>
      this.prisma.profileHasProfession.create({
        data: {
          profile_id: profileId,
          profession_id: professionId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      }),
    );

    return await Promise.all(createPromises);
  }

  async removeProfession(profileId: number, professionId: number) {
    // Supprimer le lien dans la table associative
    return await this.prisma.profileHasProfession.deleteMany({
      where: {
        profile_id: profileId,
        profession_id: professionId,
      },
    });
  }
}
