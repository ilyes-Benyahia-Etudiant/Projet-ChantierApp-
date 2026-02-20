import { Injectable } from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Line } from './entities/line.entity';

@Injectable()
export class LineService {
  constructor(private prisma: PrismaService) {}

  async create(createLineDto: CreateLineDto): Promise<Line> {
    const computedSubtotal =
      Number(createLineDto.quantity) * Number(createLineDto.price_per_qty);
    return this.prisma.line.create({
      data: {
        description: createLineDto.description,
        quantity: createLineDto.quantity,
        price_per_qty: createLineDto.price_per_qty as any,
        subtotal: computedSubtotal as any,
        estimate_id: createLineDto.estimate_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.LineFindManyArgs): Promise<Line[]> {
    return this.prisma.line.findMany(options);
  }

  async findOne(id: number): Promise<Line | null> {
    return this.prisma.line.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateLineDto): Promise<Line> {
    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };
    if (data.quantity !== undefined || data.price_per_qty !== undefined) {
      const current = await this.prisma.line.findUnique({ where: { id } });
      const qty = data.quantity ?? current?.quantity ?? 0;
      const price =
        data.price_per_qty !== undefined
          ? Number(data.price_per_qty)
          : Number(current?.price_per_qty ?? 0);
      updateData.subtotal = qty * price;
    }
    return await this.prisma.line.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Line> {
    return await this.prisma.line.delete({ where: { id } });
  }
}
