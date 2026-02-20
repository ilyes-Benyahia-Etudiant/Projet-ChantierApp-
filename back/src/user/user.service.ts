import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserWithProfileDto } from '../auth/dto/user-with-profile.dto';
const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.saveUserToDatabase(createUserDto);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async saveUserToDatabase(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return newUser;
  }

  async findAll(options?: Prisma.UserFindManyArgs): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany(options);
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const oneUser = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return plainToInstance(UserResponseDto, oneUser, {
      excludeExtraneousValues: true,
    });
  }

  async getcompleteUser(id: number): Promise<UserWithProfileDto> {
    const oneUser = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        profiles: {
          include: {
            address: true,
            skills: {
              include: {
                profession: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(UserWithProfileDto, oneUser, {
      excludeExtraneousValues: true,
    });
  }
  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const updateData: Prisma.UserUpdateInput = {
      ...data,
      updated_at: new Date(),
    };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: updateData,
    });
    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<UserResponseDto> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return plainToInstance(UserResponseDto, deletedUser, {
      excludeExtraneousValues: true,
    });
  }
}
