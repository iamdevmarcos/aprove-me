import { Test, TestingModule } from '@nestjs/testing';
import { AssignorsController } from './assignors.controller';
import { AssignorsService } from './assignors.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

describe('AssignorsController', () => {
  let controller: AssignorsController;
  let service: AssignorsService;

  const mockAssignor = {
    id: 'assignor-uuid-123',
    document: '12345678901',
    email: 'test@example.com',
    phone: '11999999999',
    name: 'Test Assignor',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorsController],
      providers: [
        {
          provide: AssignorsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssignorsController>(AssignorsController);
    service = module.get<AssignorsService>(AssignorsService);
  });

  describe('create', () => {
    it('should create an assignor', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };

      jest.spyOn(service, 'create').mockResolvedValue({ id: mockAssignor.id });

      const result = await controller.create(createAssignorDto);

      expect(result).toEqual({ id: mockAssignor.id });
      expect(service.create).toHaveBeenCalledWith(createAssignorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of assignors', async () => {
      const mockAssignors = [mockAssignor];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockAssignors as any);

      const result = await controller.findAll();

      expect(result).toEqual(mockAssignors);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an assignor by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAssignor as any);

      const result = await controller.findOne('assignor-uuid-123');

      expect(result).toEqual(mockAssignor);
      expect(service.findOne).toHaveBeenCalledWith('assignor-uuid-123');
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
        name: 'Updated Name',
      };
      const updatedAssignor = { ...mockAssignor, name: 'Updated Name' };

      jest.spyOn(service, 'update').mockResolvedValue(updatedAssignor as any);

      const result = await controller.update(
        'assignor-uuid-123',
        updateAssignorDto,
      );

      expect(result).toEqual(updatedAssignor);
      expect(service.update).toHaveBeenCalledWith(
        'assignor-uuid-123',
        updateAssignorDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete an assignor', async () => {
      const deleteResult = {
        message: 'Assignor with id assignor-uuid-123 has been deleted',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove('assignor-uuid-123');

      expect(result).toEqual(deleteResult);
      expect(service.remove).toHaveBeenCalledWith('assignor-uuid-123');
    });
  });
});
