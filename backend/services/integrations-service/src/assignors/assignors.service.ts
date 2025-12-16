import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

@Injectable()
export class AssignorsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUniqueFields(
    document?: string,
    email?: string,
    phone?: string,
    excludeId?: string,
  ): Promise<Record<string, string[]>> {
    const errors: Record<string, string[]> = {};

    if (document) {
      const existingByDocument = await this.prisma.assignor.findFirst({
        where: {
          document,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (existingByDocument) {
        errors.document = ['document already exists'];
      }
    }

    if (email) {
      const existingByEmail = await this.prisma.assignor.findFirst({
        where: {
          email,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (existingByEmail) {
        errors.email = ['email already exists'];
      }
    }

    if (phone) {
      const existingByPhone = await this.prisma.assignor.findFirst({
        where: {
          phone,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (existingByPhone) {
        errors.phone = ['phone already exists'];
      }
    }

    return errors;
  }

  async create(createAssignorDto: CreateAssignorDto) {
    const validationErrors = await this.validateUniqueFields(
      createAssignorDto.document,
      createAssignorDto.email,
      createAssignorDto.phone,
    );

    if (Object.keys(validationErrors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const assignor = await this.prisma.assignor.create({
      data: createAssignorDto,
    });

    return { id: assignor.id };
  }

  async findAll() {
    const assignors = await this.prisma.assignor.findMany({
      include: {
        payables: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assignors;
  }

  async findOne(id: string) {
    const assignor = await this.prisma.assignor.findUnique({
      where: { id },
      include: {
        payables: true,
      },
    });

    if (!assignor) {
      throw new NotFoundException(`Assignor with id ${id} not found`);
    }

    return assignor;
  }

  async update(id: string, updateAssignorDto: UpdateAssignorDto) {
    const existingAssignor = await this.prisma.assignor.findUnique({
      where: { id },
    });

    if (!existingAssignor) {
      throw new NotFoundException(`Assignor with id ${id} not found`);
    }

    const validationErrors = await this.validateUniqueFields(
      updateAssignorDto.document,
      updateAssignorDto.email,
      updateAssignorDto.phone,
      id,
    );

    if (Object.keys(validationErrors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const assignor = await this.prisma.assignor.update({
      where: { id },
      data: updateAssignorDto,
    });

    return assignor;
  }

  async remove(id: string) {
    const assignor = await this.prisma.assignor.findUnique({
      where: { id },
      include: {
        payables: true,
      },
    });

    if (!assignor) {
      throw new NotFoundException(`Assignor with id ${id} not found`);
    }

    const hasLinkedPayables = assignor.payables && assignor.payables.length > 0;
    if (hasLinkedPayables) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Não é possível excluir cedente com recebíveis vinculados',
        error:
          'Este cedente não pode ser excluído pois possui recebíveis associados. Por favor, remova todos os recebíveis antes de excluir o cedente.',
      });
    }

    await this.prisma.assignor.delete({
      where: { id },
    });

    return { message: `Assignor with id ${id} has been deleted` };
  }
}
