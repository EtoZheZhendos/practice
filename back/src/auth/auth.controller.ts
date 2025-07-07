/**
 * Контроллер аутентификации и авторизации
 * Обрабатывает HTTP запросы для регистрации, входа и получения профиля
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, Public } from './guards/jwt-auth.guard';

/**
 * Контроллер для работы с аутентификацией
 * Предоставляет эндпоинты для регистрации, входа и получения профиля
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация нового пользователя
   * Публичный эндпоинт (не требует аутентификации)
   * 
   * @param dto - Данные для регистрации (email, password, firstName, lastName)
   * @returns JWT токен и данные пользователя
   * 
   * @example
   * POST /auth/register
   * {
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "firstName": "Иван",
   *   "lastName": "Иванов"
   * }
   */
  @Public()  // Декоратор для публичного доступа (без JWT)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log('Register request:', dto);
    return this.authService.register(dto);
  }

  /**
   * Вход пользователя в систему
   * Публичный эндпоинт (не требует аутентификации)
   * 
   * @param dto - Данные для входа (email, password)
   * @returns JWT токен и данные пользователя
   * 
   * @example
   * POST /auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   */
  @Public()  // Декоратор для публичного доступа (без JWT)
  @Post('login')
  login(@Body() dto: LoginDto) {
    console.log('Login request:', dto);
    return this.authService.login(dto);
  }

  /**
   * Получение профиля авторизованного пользователя
   * Защищенный эндпоинт (требует JWT токен)
   * 
   * @param req - HTTP запрос с данными пользователя из JWT токена
   * @returns Данные профиля пользователя
   * 
   * @example
   * GET /auth/profile
   * Authorization: Bearer <jwt_token>
   */
  @UseGuards(JwtAuthGuard)  // Защита JWT токеном
  @Get('profile')
  profile(@Request() req) {
    console.log('Profile request from user:', req.user);
    // req.user.userId - ID пользователя из JWT токена
    return this.authService.getProfile(req.user.userId);
  }
} 