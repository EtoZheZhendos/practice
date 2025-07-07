/**
 * Скрипт сидирования базы данных
 * Заполняет базу данных начальными данными для разработки и тестирования
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedInitialData } from './seeds/initial-data.seed';

/**
 * Основная функция сидирования
 * Создает контекст приложения и запускает заполнение базы данных
 */
async function seed() {
  // Создание контекста приложения без HTTP сервера
  // Позволяет использовать все сервисы и модули приложения
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🚀 Starting database seeding...');
    
    // Запуск процесса заполнения базы данных
    await seedInitialData();
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    // Обработка ошибок при сидировании
    console.error('❌ Error seeding database:', error);
  } finally {
    // Закрытие контекста приложения в любом случае
    await app.close();
  }
}

// Запуск сидирования при выполнении скрипта
seed(); 