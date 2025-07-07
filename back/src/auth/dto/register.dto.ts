/**
 * DTO для регистрации пользователя
 * Определяет структуру данных, необходимых для создания нового пользователя
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * Data Transfer Object для регистрации пользователя
 * Содержит валидацию полей с помощью class-validator
 * 
 * @example
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "firstName": "Иван",
 *   "lastName": "Иванов",
 *   "avatar": "https://example.com/avatar.jpg"
 * }
 */
export class RegisterDto {
  /**
   * Email пользователя
   * Должен быть валидным email адресом
   * Используется для входа в систему и должен быть уникальным
   */
  @IsEmail()
  email: string;

  /**
   * Пароль пользователя
   * Минимальная длина 6 символов
   * Будет хеширован перед сохранением в базу данных
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Имя пользователя
   * Обязательное поле для идентификации пользователя
   */
  @IsString()
  firstName: string;

  /**
   * Фамилия пользователя
   * Обязательное поле для идентификации пользователя
   */
  @IsString()
  lastName: string;

  /**
   * URL аватара пользователя
   * Необязательное поле
   * Может содержать ссылку на изображение профиля
   */
  @IsOptional()
  @IsString()
  avatar?: string;
} 