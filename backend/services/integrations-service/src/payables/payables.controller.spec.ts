import { Test, TestingModule } from '@nestjs/testing';
import { PayablesController } from './payables.controller';
import { PayablesService } from './payables.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

describe('PayablesController', () => {
  let controller: PayablesController;
  let service: PayablesService;

  const mockPayable = {
    id: 'payable-uuid-123',
    value: 1000.5,
    emissionDate: new Date('2024-01-01'),
    assignorId: 'assignor-uuid-123',
    assignor: {
      id: 'assignor-uuid-123',
      document: '12345678901',
      email: 'test@example.com',
      phone: '11999999999',
      name: 'Test Assignor',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayablesController],
      providers: [
        {
          provide: PayablesService,
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

    controller = module.get<PayablesController>(PayablesController);
    service = module.get<PayablesService>(PayablesService);
  });

  describe('create', () => {
    it('should create a payable', async () => {
      const createPayableDto: CreatePayableDto = {
        value: 1000.5,
        emissionDate: '2024-01-01',
        assignorId: 'assignor-uuid-123',
      };

      jest.spyOn(service, 'create').mockResolvedValue({ id: mockPayable.id });

      const result = await controller.create(createPayableDto);

      expect(result).toEqual({ id: mockPayable.id });
      expect(service.create).toHaveBeenCalledWith(createPayableDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of payables', async () => {
      const mockPayables = [mockPayable];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPayables as any);

      const result = await controller.findAll();

      expect(result).toEqual(mockPayables);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a payable by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPayable as any);

      const result = await controller.findOne('payable-uuid-123');

      expect(result).toEqual(mockPayable);
      expect(service.findOne).toHaveBeenCalledWith('payable-uuid-123');
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const updatePayableDto: UpdatePayableDto = {
        value: 2000.0,
      };
      const updatedPayable = { ...mockPayable, value: 2000.0 };

      jest.spyOn(service, 'update').mockResolvedValue(updatedPayable as any);

      const result = await controller.update(
        'payable-uuid-123',
        updatePayableDto,
      );

      expect(result).toEqual(updatedPayable);
      expect(service.update).toHaveBeenCalledWith(
        'payable-uuid-123',
        updatePayableDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a payable', async () => {
      const deleteResult = {
        message: 'Payable with id payable-uuid-123 has been deleted',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove('payable-uuid-123');

      expect(result).toEqual(deleteResult);
      expect(service.remove).toHaveBeenCalledWith('payable-uuid-123');
    });
  });
});
