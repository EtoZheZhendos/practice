/**
 * Сервис аутентификации и авторизации
 * Обеспечивает регистрацию, вход и управление JWT токенами
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

/**
 * Сервис для работы с аутентификацией пользователей
 * Включает методы регистрации, входа и валидации пользователей
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,  // Сервис для работы с пользователями
    private jwtService: JwtService,     // Сервис для работы с JWT токенами
  ) {}

  /**
   * Валидация пользователя по email и паролю
   * Используется для проверки учетных данных при входе
   * 
   * @param email - Email пользователя
   * @param password - Пароль пользователя
   * @returns Пользователь или null если данные неверные
   */
  async validateUser(email: string, password: string) {
    // Поиск пользователя по email
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    
    // Сравнение хеша пароля с введенным паролем
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    return user;
  }

  /**
   * Вход пользователя в систему
   * Проверяет учетные данные и возвращает JWT токен
   * 
   * @param dto - Данные для входа (email, password)
   * @returns Объект с токеном доступа и данными пользователя
   * @throws UnauthorizedException если данные неверные
   */
  async login(dto: LoginDto) {
    console.log('Login attempt for email:', dto.email);
    
    // Поиск пользователя по email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      console.log('User not found for email:', dto.email);
      throw new UnauthorizedException('User not found');
    }
    
    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    
    // Проверка наличия пароля у пользователя
    if (!user.password) {
      console.log('User has no password');
      throw new UnauthorizedException('Invalid user data');
    }
    
    // Проверка корректности пароля
    const isMatch = await bcrypt.compare(dto.password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    
    // Создание payload для JWT токена
    // sub - ID пользователя, email - email, roles - массив ролей
    const payload = { sub: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
    console.log('JWT payload:', payload);
    
    // Подписание JWT токена
    const token = this.jwtService.sign(payload);
    
    // Формирование ответа с токеном и данными пользователя
    const result = {
      access_token: token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
    };
    
    console.log('Login successful, returning result');
    return result;
  }

  /**
   * Регистрация нового пользователя
   * Создает пользователя с хешированным паролем и возвращает JWT токен
   * 
   * @param dto - Данные для регистрации (email, password, firstName, lastName)
   * @returns Объект с токеном доступа и данными пользователя
   * @throws ConflictException если пользователь уже существует
   */
  async register(dto: RegisterDto) {
    // Проверка существования пользователя с таким email
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('User already exists');
    
    // Создание нового пользователя (пароль хешируется в UsersService)
    const user = await this.usersService.create({ ...dto });
    
    // Создание payload для JWT токена
    const payload = { sub: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
    
    // Возврат токена и данных пользователя
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
    };
  }

  /**
   * Получение профиля пользователя по ID
   * Используется для получения данных авторизованного пользователя
   * 
   * @param userId - ID пользователя
   * @returns Данные пользователя
   * @throws UnauthorizedException если пользователь не найден
   */
  async getProfile(userId: number) {
    console.log('Getting profile for userId:', userId);
    
    // Поиск пользователя по ID
    const user = await this.usersService.findOne(userId);
    if (!user) {
      console.log('User not found for userId:', userId);
      throw new UnauthorizedException('User not found');
    }
    
    console.log('Profile found:', { id: user.id, email: user.email });
    return user;
  }
} 