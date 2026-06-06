import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';
import { BCRYPT_ROUNDS, DEFAULT_ROLE } from '@/modules/auth/constants';
import { LoginDto, RegisterDto, TokenResponseDto, UserResponseDto } from '@/modules/auth/dtos';
import {
  I_JwtPayload,
  UserWithRole,
  userWithRoleSelect,
} from '@/modules/auth/types';
import { PrismaService } from '@/shared/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }


  async login(loginDto: LoginDto): Promise<TokenResponseDto> {


    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { ...userWithRoleSelect, passwordHash: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);

  }

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const { name, email, password } = registerDto;

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          UserRole: {
            create: { role: DEFAULT_ROLE },
          },
        },
        select: userWithRoleSelect,
      });

      return this.issueTokens(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`${email} is already used`);
      }

      throw error;
    }
  }

    async getMe(user: I_JwtPayload): Promise<UserResponseDto> {

      const user_data = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: userWithRoleSelect,
      });

      if (!user_data) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user_data.id,
        name: user_data.name,
        email: user_data.email,
        avatarUrl: user_data.avatarUrl,
        roles: user_data.UserRole.map(({ role }) => role),
      };

    }

  private async issueTokens(user: UserWithRole): Promise<TokenResponseDto> {
    const payload = this.buildJwtPayload(user);
    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'auth.jwt.refreshExpiresIn',
    );

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('auth.jwt.refreshSecret'),
      expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
    });

    await this.prisma.session.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: this.getRefreshTokenExpiresAt(refreshExpiresIn),
      },
    });

    return { accessToken, refreshToken };
  }

  private buildJwtPayload(user: UserWithRole): I_JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      roles: user.UserRole.map(({ role }) => role),
    };
  }

  private getRefreshTokenExpiresAt(expiresIn: string): Date {
    return new Date(Date.now() + this.parseExpiresInToMs(expiresIn));
  }

  private parseExpiresInToMs(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    const value = Number(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return value * multipliers[unit];
  }
}
