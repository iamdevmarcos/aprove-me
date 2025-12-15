import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'uuid-123',
    login: 'testuser',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'bcrypt.saltRounds') return 10;
              if (key === 'jwt.refreshExpiration') return '7d';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedpassword');

      const result = await service.register({
        login: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual({ id: mockUser.id });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          login: 'testuser',
          password: 'hashedpassword',
        },
      });
    });

    it('should throw ConflictException if login already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(
        service.register({
          login: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return JWT token and refresh token for valid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.login({
        login: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual({
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login({
          login: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid password', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        login: mockUser.login,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(userWithoutPassword as any);

      const result = await service.findById(mockUser.id);

      expect(result).toEqual(userWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('refreshToken', () => {
    it('should return new access token for valid refresh token', async () => {
      const mockRefreshToken = 'valid-refresh-token';
      const mockPayload = {
        sub: mockUser.id,
        login: mockUser.login,
        type: 'refresh',
      };
      const userWithoutPassword = {
        id: mockUser.id,
        login: mockUser.login,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload as any);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(userWithoutPassword as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new-access-token');

      const result = await service.refreshToken(mockRefreshToken);

      expect(result).toEqual({ token: 'new-access-token' });
      expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshToken);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        'Refresh token inválido ou expirado',
      );
    });
  });

  describe('logout', () => {
    it('should return success message', () => {
      const result = service.logout();

      expect(result).toEqual({ message: 'Logout realizado com sucesso' });
    });
  });
});
