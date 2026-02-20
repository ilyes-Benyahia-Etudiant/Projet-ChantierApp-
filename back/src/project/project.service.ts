import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        start_date: new Date(createProjectDto.start_date),
        address_id: createProjectDto.address_id,
        customer_id: createProjectDto.customer_id,
        entreprise_id: createProjectDto.entreprise_id,
        is_finished: createProjectDto.is_finished ?? false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany({
      ...options,
      include: {
        customer: {
          include: {
            profiles: true,
          },
        },
        address: true,
        tasks: {
          include: {
            professions: {
              include: { profession: true },
            },
          },
        },
      },
    });
  }

  async findOneWithTask(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            professions: {
              include: { profession: true },
            },
          },
        },
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        OR: [{ customer_id: userId }, { entreprise_id: userId }],
      },
      include: {
        customer: {
          include: {
            profiles: true,
          },
        },
        address: true,
        tasks: {
          include: {
            professions: {
              include: { profession: true },
            },
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };

    // Convertir start_date en Date si présent
    if (data.start_date) {
      updateData.start_date = new Date(data.start_date);
    }

    return await this.prisma.project.update({
      where: { id: id },
      data: updateData,
    });
  }

  async accept(id: number, entrepriseId: number): Promise<Project> {
    return await this.prisma.project.update({
      where: { id },
      data: {
        entreprise_id: entrepriseId,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.project.delete({ where: { id } });
    return true;
  }
}
