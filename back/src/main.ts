/**
 * Главный файл приложения TaskManager
 * Точка входа в NestJS приложение
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Функция инициализации приложения
 * Создает и настраивает NestJS приложение
 */
async function bootstrap() {
  // Создание экземпляра приложения с корневым модулем
  const app = await NestFactory.create(AppModule);
  
  // Настройка глобальной валидации данных
  // whitelist: true - удаляет свойства, не определенные в DTO
  // forbidNonWhitelisted: true - выбрасывает ошибку при наличии лишних свойств
  // transform: true - автоматически преобразует типы данных
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Настройка CORS для взаимодействия с фронтендом
  // Разрешаем запросы с Quasar dev сервера (порты 9000 и 8080)
  // credentials: true - разрешаем передачу куки и заголовков авторизации
  app.enableCors({
    origin: ['http://localhost:9000', 'http://localhost:8080'], // Quasar dev server
    credentials: true,
  });
  
  // Запуск сервера на указанном порту (по умолчанию 3001)
  await app.listen(process.env.PORT ?? 3001);
  
  console.log(`🚀 TaskManager API запущен на порту ${process.env.PORT ?? 3001}`);
}

// Запуск приложения
bootstrap();
