import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthResponse, JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>('bcrypt.saltRounds') || 10;
  }

  async register(createUserDto: CreateUserDto): Promise<{ id: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      throw new ConflictException('Login já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword,
      },
    });

    return { id: user.id };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessPayload: JwtPayload = {
      sub: user.id,
      login: user.login,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      login: user.login,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessPayload as any);
    const refreshExpiration =
      this.configService.get<string>('jwt.refreshExpiration') || '7d';
    const refreshToken = this.jwtService.sign(
      refreshPayload as any,
      {
        expiresIn: refreshExpiration,
      } as any,
    );

    return {
      token: accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const accessPayload: JwtPayload = {
        sub: user.id,
        login: user.login,
        type: 'access',
      };

      return {
        token: this.jwtService.sign(accessPayload as any),
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async validateUser(login: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  logout(): { message: string } {
    return { message: 'Logout realizado com sucesso' };
  }
}
