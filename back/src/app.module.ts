/**
 * Корневой модуль приложения TaskManager
 * Конфигурирует все модули и зависимости приложения
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { HistoryModule } from './history/history.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';

/**
 * Главный модуль приложения
 * Объединяет все функциональные модули и настраивает глобальные провайдеры
 */
@Module({
  imports: [
    // Конфигурация базы данных SQLite
    // dialect: 'sqlite' - используем SQLite как СУБД
    // storage: './database.sqlite' - файл базы данных
    // autoLoadModels: true - автоматическая загрузка моделей Sequelize
    // synchronize: true - автоматическая синхронизация схемы БД
    // define: { underscored: false } - не использовать snake_case для имен полей
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './database.sqlite',
      autoLoadModels: true,
      synchronize: true,
      define: {
        underscored: false,
      },
    }),
    
    // Импорт всех функциональных модулей приложения
    AuthModule,        // Модуль аутентификации и авторизации
    TasksModule,       // Модуль управления задачами
    UsersModule,       // Модуль управления пользователями
    RolesModule,       // Модуль управления ролями
    CommentsModule,    // Модуль комментариев
    CategoriesModule,  // Модуль категорий
    ProjectsModule,    // Модуль проектов
    HistoryModule,     // Модуль истории изменений
  ],
  
  // Глобальные контроллеры приложения
  controllers: [AppController],
  
  // Глобальные провайдеры
  providers: [
    AppService,        // Основной сервис приложения
    Reflector,         // Рефлектор для работы с метаданными
    // Глобальный guard для JWT аутентификации
    // Применяется ко всем маршрутам по умолчанию
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
})
export class AppModule {}
