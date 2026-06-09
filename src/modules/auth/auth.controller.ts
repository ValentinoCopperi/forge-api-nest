import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public, UserCurrent } from '@/modules/auth/decorators';
import { I_JwtPayload } from '@/modules/auth/types';
import {
  AccessTokenResponseDto,
  LoginDto,
  RegisterDto,
  TokenResponseDto,
  UserResponseDto,
} from '@/modules/auth/dtos';
import { REFRESH_TOKEN_COOKIE_PATH } from '@/modules/auth/constants';
import { AuthService } from './auth.service';
import { ApiCommonErrors, Cookies } from '@/shared/decorators';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@ApiCommonErrors()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  private getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: REFRESH_TOKEN_COOKIE_PATH,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates an account and returns auth tokens. The user is logged in automatically.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Email already in use' })
  register(@Body() registerDto: RegisterDto): Promise<TokenResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in',
    description: 'Authenticates a user and returns auth tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenResponseDto> {
    const { accessToken , refreshToken } = await this.authService.login(loginDto);

    res.cookie('refresh_token', refreshToken, {
      ...this.getRefreshTokenCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };

  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Issues a new access token using a valid refresh token.',
  })
  @ApiOkResponse({
    description: 'New access token issued successfully',
    type: AccessTokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  refresh(
    @Cookies('refresh_token') refresh_token: string,
  ): Promise<AccessTokenResponseDto> {
    return this.authService.refresh(refresh_token);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign out',
    description: 'Revokes the current session and clears the refresh token cookie.',
  })
  @ApiOkResponse({ description: 'User signed out successfully' })
  async logout(
    @Cookies('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(refresh_token);
    res.clearCookie('refresh_token', this.getRefreshTokenCookieOptions());
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user from the JWT payload.',
  })
  @ApiOkResponse({
    description: 'Current authenticated user',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  getMe(@UserCurrent() user: I_JwtPayload): Promise<UserResponseDto> {
    return this.authService.getMe(user);
  }
}
