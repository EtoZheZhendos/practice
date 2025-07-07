/**
 * JWT Guard для аутентификации
 * Проверяет JWT токены и управляет доступом к защищенным маршрутам
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// Ключ метаданных для публичных маршрутов
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор для обозначения публичных маршрутов
 * Позволяет обойти JWT аутентификацию для определенных эндпоинтов
 * 
 * @param target - Целевой объект (класс или метод)
 * @param key - Ключ свойства (для методов)
 * @param descriptor - Дескриптор свойства (для методов)
 * @returns Модифицированный дескриптор или целевой объект
 * 
 * @example
 * @Public()
 * @Post('login')
 * login() { ... }
 */
export function Public() {
  return (target: any, key?: any, descriptor?: any) => {
    // Установка метаданных для обозначения публичного маршрута
    Reflect.defineMetadata(IS_PUBLIC_KEY, true, descriptor ? descriptor.value : target);
    return descriptor || target;
  };
}

/**
 * JWT Guard для проверки аутентификации
 * Расширяет стандартный AuthGuard для работы с JWT токенами
 * Позволяет обходить аутентификацию для публичных маршрутов
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Проверяет, может ли запрос быть обработан
   * Проверяет наличие декоратора @Public() и JWT токена
   * 
   * @param context - Контекст выполнения (HTTP запрос)
   * @returns true если доступ разрешен, false если запрещен
   */
  canActivate(context: ExecutionContext) {
    // Проверка наличия декоратора @Public() на методе или классе
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),  // Проверка на уровне метода
      context.getClass(),    // Проверка на уровне класса
    ]);
    
    // Если маршрут публичный - пропускаем аутентификацию
    if (isPublic) {
      return true;
    }
    
    // Иначе выполняем стандартную JWT аутентификацию
    return super.canActivate(context);
  }
} 