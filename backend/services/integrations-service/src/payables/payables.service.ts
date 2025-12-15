import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

@Injectable()
export class PayablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPayableDto: CreatePayableDto) {
    const assignor = await this.prisma.assignor.findUnique({
      where: { id: createPayableDto.assignorId },
    });

    if (!assignor) {
      throw new NotFoundException(
        `Assignor with id ${createPayableDto.assignorId} not found. Please create the assignor first.`,
      );
    }

    const payable = await this.prisma.payable.create({
      data: {
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignorId: createPayableDto.assignorId,
      },
    });

    return { id: payable.id };
  }

  async findAll() {
    const payables = await this.prisma.payable.findMany({
      include: {
        assignor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payables;
  }

  async findOne(id: string) {
    const payable = await this.prisma.payable.findUnique({
      where: { id },
      include: {
        assignor: true,
      },
    });

    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }

    return payable;
  }

  async update(id: string, updatePayableDto: UpdatePayableDto) {
    const existingPayable = await this.prisma.payable.findUnique({
      where: { id },
    });

    if (!existingPayable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }

    const updateData: any = {};

    if (updatePayableDto.value !== undefined) {
      updateData.value = updatePayableDto.value;
    }

    if (updatePayableDto.emissionDate !== undefined) {
      updateData.emissionDate = new Date(updatePayableDto.emissionDate);
    }

    if (updatePayableDto.assignorId !== undefined) {
      const assignor = await this.prisma.assignor.findUnique({
        where: { id: updatePayableDto.assignorId },
      });

      if (!assignor) {
        throw new NotFoundException(
          `Assignor with id ${updatePayableDto.assignorId} not found`,
        );
      }

      updateData.assignorId = updatePayableDto.assignorId;
    }

    const payable = await this.prisma.payable.update({
      where: { id },
      data: updateData,
      include: {
        assignor: true,
      },
    });

    return payable;
  }

  async remove(id: string) {
    const payable = await this.prisma.payable.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }

    await this.prisma.payable.delete({
      where: { id },
    });

    return { message: `Payable with id ${id} has been deleted` };
  }
}
