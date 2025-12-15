import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

describe('PayablesService', () => {
  let service: PayablesService;
  let prisma: PrismaService;

  const mockAssignor = {
    id: 'assignor-uuid-123',
    document: '12345678901',
    email: 'test@example.com',
    phone: '11999999999',
    name: 'Test Assignor',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPayable = {
    id: 'payable-uuid-123',
    value: 1000.5,
    emissionDate: new Date('2024-01-01'),
    assignorId: 'assignor-uuid-123',
    assignor: mockAssignor,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayablesService,
        {
          provide: PrismaService,
          useValue: {
            assignor: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            payable: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PayablesService>(PayablesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payable with existing assignor', async () => {
      const createPayableDto: CreatePayableDto = {
        value: 1000.5,
        emissionDate: '2024-01-01',
        assignorId: 'assignor-uuid-123',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(mockAssignor as any);
      jest
        .spyOn(prisma.payable, 'create')
        .mockResolvedValue(mockPayable as any);

      const result = await service.create(createPayableDto);

      expect(result).toEqual({ id: mockPayable.id });
      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: createPayableDto.assignorId },
      });
      expect(prisma.payable.create).toHaveBeenCalledWith({
        data: {
          value: createPayableDto.value,
          emissionDate: new Date(createPayableDto.emissionDate),
          assignorId: createPayableDto.assignorId,
        },
      });
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      const createPayableDto: CreatePayableDto = {
        value: 1000.5,
        emissionDate: '2024-01-01',
        assignorId: 'non-existent-assignor',
      };

      jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

      await expect(service.create(createPayableDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.payable.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of payables', async () => {
      const mockPayables = [mockPayable];

      jest
        .spyOn(prisma.payable, 'findMany')
        .mockResolvedValue(mockPayables as any);

      const result = await service.findAll();

      expect(result).toEqual(mockPayables);
      expect(prisma.payable.findMany).toHaveBeenCalledWith({
        include: { assignor: true },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should return an empty array when no payables exist', async () => {
      jest.spyOn(prisma.payable, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.payable.findMany).toHaveBeenCalledWith({
        include: { assignor: true },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a payable by id', async () => {
      jest
        .spyOn(prisma.payable, 'findUnique')
        .mockResolvedValue(mockPayable as any);

      const result = await service.findOne('payable-uuid-123');

      expect(result).toEqual(mockPayable);
      expect(prisma.payable.findUnique).toHaveBeenCalledWith({
        where: { id: 'payable-uuid-123' },
        include: { assignor: true },
      });
    });

    it('should throw NotFoundException if payable does not exist', async () => {
      jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const updatePayableDto: UpdatePayableDto = {
        value: 2000.0,
      };

      jest
        .spyOn(prisma.payable, 'findUnique')
        .mockResolvedValue(mockPayable as any);
      jest
        .spyOn(prisma.payable, 'update')
        .mockResolvedValue({ ...mockPayable, value: 2000.0 } as any);

      const result = await service.update('payable-uuid-123', updatePayableDto);

      expect(result.value).toBe(2000.0);
      expect(prisma.payable.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if payable does not exist', async () => {
      const updatePayableDto: UpdatePayableDto = {
        value: 2000.0,
      };

      jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updatePayableDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if assignor does not exist when updating assignorId', async () => {
      const updatePayableDto: UpdatePayableDto = {
        assignorId: 'non-existent-assignor',
      };

      jest
        .spyOn(prisma.payable, 'findUnique')
        .mockResolvedValue(mockPayable as any);
      jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('payable-uuid-123', updatePayableDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a payable', async () => {
      jest
        .spyOn(prisma.payable, 'findUnique')
        .mockResolvedValue(mockPayable as any);
      jest
        .spyOn(prisma.payable, 'delete')
        .mockResolvedValue(mockPayable as any);

      const result = await service.remove('payable-uuid-123');

      expect(result).toEqual({
        message: 'Payable with id payable-uuid-123 has been deleted',
      });
      expect(prisma.payable.delete).toHaveBeenCalledWith({
        where: { id: 'payable-uuid-123' },
      });
    });

    it('should throw NotFoundException if payable does not exist', async () => {
      jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
