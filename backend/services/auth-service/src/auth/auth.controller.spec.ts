import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT token and refresh token', async () => {
      const loginDto = { login: 'testuser', password: 'password123' };
      const expectedResult = {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto = { login: 'newuser', password: 'password123' };
      const expectedResult = { id: 'uuid-123' };

      jest.spyOn(service, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('refresh', () => {
    it('should return new access token', async () => {
      const refreshTokenDto = { refreshToken: 'valid-refresh-token' };
      const expectedResult = { token: 'new-access-token' };

      jest.spyOn(service, 'refreshToken').mockResolvedValue(expectedResult);

      const result = await controller.refresh(refreshTokenDto);

      expect(result).toEqual(expectedResult);
      expect(service.refreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
    });
  });

  describe('logout', () => {
    it('should return success message', () => {
      const expectedResult = { message: 'Logout realizado com sucesso' };

      jest.spyOn(service, 'logout').mockReturnValue(expectedResult);

      const result = controller.logout();

      expect(result).toEqual(expectedResult);
      expect(service.logout).toHaveBeenCalled();
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      const result = controller.health();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
