import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Вход в систему',
    description:
      'Войдите в систему используя email и пароль. Получите access token и refresh token.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Обновление токена доступа',
    description:
      'Обновите access token используя refresh token. Можно передать refresh token в теле запроса или в заголовке Authorization.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description:
      'Refresh token (можно передать в теле запроса или использовать Bearer Auth)',
  })
  @ApiBearerAuth('refresh-token')
  @ApiHeader({
    name: 'Authorization',
    description:
      'Bearer refresh_token (альтернативный способ передачи refresh token)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Токен успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверный refresh токен' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let refreshToken = refreshTokenDto.refreshToken;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      refreshToken = authHeader.substring(7);
    }

    const tokens = await this.authService.refreshToken({ refreshToken });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Выйдите из системы. Refresh token будет удален из cookies.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    return { message: 'Успешный выход из системы' };
  }
}
