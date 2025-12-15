import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AssignorsService } from './assignors.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

describe('AssignorsService', () => {
  let service: AssignorsService;
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

  const mockAssignorWithPayables = {
    ...mockAssignor,
    payables: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorsService,
        {
          provide: PrismaService,
          useValue: {
            assignor: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssignorsService>(AssignorsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an assignor', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest.spyOn(prisma.assignor, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.assignor, 'create')
        .mockResolvedValue(mockAssignor as any);

      const result = await service.create(createAssignorDto);

      expect(result).toEqual({ id: mockAssignor.id });
      expect(prisma.assignor.create).toHaveBeenCalledWith({
        data: createAssignorDto,
      });
    });

    it('should throw BadRequestException when document already exists', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(mockAssignor as any);

      try {
        await service.create(createAssignorDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          document: ['document already exists'],
        });
      }
    });

    it('should throw BadRequestException when email already exists', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAssignor as any);

      try {
        await service.create(createAssignorDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          email: ['email already exists'],
        });
      }
    });

    it('should throw BadRequestException when phone already exists', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAssignor as any);

      try {
        await service.create(createAssignorDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          phone: ['phone already exists'],
        });
      }
    });

    it('should throw BadRequestException with multiple errors when multiple fields are duplicated', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(mockAssignor as any)
        .mockResolvedValueOnce(mockAssignor as any);

      try {
        await service.create(createAssignorDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          document: ['document already exists'],
          email: ['email already exists'],
        });
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of assignors', async () => {
      const mockAssignors = [mockAssignorWithPayables];

      jest
        .spyOn(prisma.assignor, 'findMany')
        .mockResolvedValue(mockAssignors as any);

      const result = await service.findAll();

      expect(result).toEqual(mockAssignors);
      expect(prisma.assignor.findMany).toHaveBeenCalledWith({
        include: { payables: true },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should return an empty array when no assignors exist', async () => {
      jest.spyOn(prisma.assignor, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.assignor.findMany).toHaveBeenCalledWith({
        include: { payables: true },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an assignor by id', async () => {
      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(mockAssignorWithPayables as any);

      const result = await service.findOne('assignor-uuid-123');

      expect(result).toEqual(mockAssignorWithPayables);
      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: 'assignor-uuid-123' },
        include: { payables: true },
      });
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        name: 'Updated Name',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(mockAssignor as any);
      jest.spyOn(prisma.assignor, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.assignor, 'update')
        .mockResolvedValue({ ...mockAssignor, name: 'Updated Name' } as any);

      const result = await service.update(
        'assignor-uuid-123',
        updateAssignorDto,
      );

      expect(result.name).toBe('Updated Name');
      expect(prisma.assignor.update).toHaveBeenCalledWith({
        where: { id: 'assignor-uuid-123' },
        data: updateAssignorDto,
      });
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        name: 'Updated Name',
      };

      jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateAssignorDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when updating with duplicate document', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        document: '99999999999',
      };

      const existingAssignor = { ...mockAssignor, id: 'assignor-uuid-123' };
      const duplicateAssignor = {
        ...mockAssignor,
        id: 'other-uuid',
        document: '99999999999',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(existingAssignor as any);
      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(duplicateAssignor as any);

      try {
        await service.update('assignor-uuid-123', updateAssignorDto);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          document: ['document already exists'],
        });
      }
    });

    it('should throw BadRequestException when updating with duplicate email', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        email: 'duplicate@example.com',
      };

      const existingAssignor = { ...mockAssignor, id: 'assignor-uuid-123' };
      const duplicateAssignor = {
        ...mockAssignor,
        id: 'other-uuid',
        email: 'duplicate@example.com',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(existingAssignor as any);
      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(duplicateAssignor as any);

      try {
        await service.update('assignor-uuid-123', updateAssignorDto);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          email: ['email already exists'],
        });
      }
    });

    it('should throw BadRequestException when updating with duplicate phone', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        phone: '11888888888',
      };

      const existingAssignor = { ...mockAssignor, id: 'assignor-uuid-123' };
      const duplicateAssignor = {
        ...mockAssignor,
        id: 'other-uuid',
        phone: '11888888888',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(existingAssignor as any);
      jest
        .spyOn(prisma.assignor, 'findFirst')
        .mockResolvedValueOnce(duplicateAssignor as any);

      try {
        await service.update('assignor-uuid-123', updateAssignorDto);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response).toHaveProperty('errors');
        expect(response.errors).toEqual({
          phone: ['phone already exists'],
        });
      }
    });

    it('should allow update when keeping the same unique values (same assignor)', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        document: mockAssignor.document,
        name: 'Updated Name',
      };

      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(mockAssignor as any);
      jest.spyOn(prisma.assignor, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.assignor, 'update')
        .mockResolvedValue({ ...mockAssignor, name: 'Updated Name' } as any);

      const result = await service.update(
        'assignor-uuid-123',
        updateAssignorDto,
      );

      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should delete an assignor', async () => {
      jest
        .spyOn(prisma.assignor, 'findUnique')
        .mockResolvedValue(mockAssignor as any);
      jest
        .spyOn(prisma.assignor, 'delete')
        .mockResolvedValue(mockAssignor as any);

      const result = await service.remove('assignor-uuid-123');

      expect(result).toEqual({
        message: 'Assignor with id assignor-uuid-123 has been deleted',
      });
      expect(prisma.assignor.delete).toHaveBeenCalledWith({
        where: { id: 'assignor-uuid-123' },
      });
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
