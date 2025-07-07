<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# TaskManager Backend

## 📋 Описание

Backend система управления задачами, построенная на NestJS с использованием SQLite и Sequelize ORM. Система обеспечивает полный цикл управления задачами, пользователями, проектами и категориями.

## 🏗️ Архитектура

### Технологический стек
- **Framework**: NestJS (Node.js)
- **Database**: SQLite с Sequelize ORM
- **Authentication**: JWT токены
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **CORS**: Настроен для работы с Quasar frontend

### Структура проекта

```
src/
├── main.ts                    # Точка входа приложения
├── app.module.ts             # Корневой модуль
├── app.controller.ts         # Основной контроллер
├── app.service.ts            # Основной сервис
├── auth/                     # Модуль аутентификации
│   ├── auth.controller.ts    # Контроллер аутентификации
│   ├── auth.service.ts       # Сервис аутентификации
│   ├── auth.module.ts        # Модуль аутентификации
│   ├── guards/               # Guards для защиты маршрутов
│   │   └── jwt-auth.guard.ts # JWT Guard
│   ├── strategies/           # Стратегии аутентификации
│   │   └── jwt.strategy.ts   # JWT Strategy
│   └── dto/                  # DTO для аутентификации
│       ├── login.dto.ts      # DTO для входа
│       └── register.dto.ts   # DTO для регистрации
├── users/                    # Модуль пользователей
│   ├── users.controller.ts   # Контроллер пользователей
│   ├── users.service.ts      # Сервис пользователей
│   ├── users.module.ts       # Модуль пользователей
│   ├── models/               # Модели пользователей
│   │   └── user.model.ts     # Модель пользователя
│   ├── dto/                  # DTO для пользователей
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── interfaces/           # Интерфейсы
│       └── user.interface.ts
├── tasks/                    # Модуль задач
│   ├── tasks.controller.ts   # Контроллер задач
│   ├── tasks.service.ts      # Сервис задач
│   ├── tasks.module.ts       # Модуль задач
│   ├── models/               # Модели задач
│   │   ├── task.model.ts     # Модель задачи
│   │   └── task-assignment.model.ts # Модель назначения
│   ├── dto/                  # DTO для задач
│   │   ├── create-task.dto.ts
│   │   └── update-task.dto.ts
│   └── interfaces/           # Интерфейсы
│       └── task.interface.ts
├── projects/                 # Модуль проектов
├── categories/               # Модуль категорий
├── comments/                 # Модуль комментариев
├── roles/                    # Модуль ролей
├── history/                  # Модуль истории
└── database/                 # База данных
    ├── seed.ts               # Скрипт сидирования
    └── seeds/                # Начальные данные
        └── initial-data.seed.ts
```

## 🔐 Аутентификация и авторизация

### JWT Guard
- **Файл**: `auth/guards/jwt-auth.guard.ts`
- **Назначение**: Защита маршрутов с помощью JWT токенов
- **Особенности**: 
  - Поддержка публичных маршрутов через декоратор `@Public()`
  - Автоматическая проверка токенов
  - Извлечение данных пользователя из токена

### Стратегия JWT
- **Файл**: `auth/strategies/jwt.strategy.ts`
- **Назначение**: Валидация JWT токенов
- **Функции**:
  - Проверка подписи токена
  - Извлечение payload с данными пользователя
  - Проверка срока действия токена

### Сервис аутентификации
- **Файл**: `auth/auth.service.ts`
- **Основные методы**:
  - `register()` - регистрация пользователя
  - `login()` - вход в систему
  - `validateUser()` - валидация пользователя
  - `getProfile()` - получение профиля

## 📊 Модели данных

### Пользователь (User)
- **Основные поля**: id, email, password, firstName, lastName
- **Связи**: roles (many-to-many), createdTasks (one-to-many)
- **Особенности**: Хеширование паролей, мягкое удаление

### Задача (Task)
- **Основные поля**: id, title, description, status, priority, dueDate
- **Связи**: 
  - createdBy (belongs-to User)
  - categories (many-to-many)
  - projects (many-to-many)
  - assignments (one-to-many)
  - comments (one-to-many)

### Роль (Role)
- **Основные поля**: id, name, description
- **Связи**: users (many-to-many через UserRole)

### Категория (Category)
- **Основные поля**: id, name, description, color
- **Связи**: tasks (many-to-many через TaskCategory)

### Проект (Project)
- **Основные поля**: id, name, description, status, color
- **Связи**: tasks (many-to-many через TaskProject)

## 🔄 API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему
- `GET /auth/profile` - Получение профиля (защищенный)

### Пользователи
- `GET /users` - Получение всех пользователей
- `GET /users/:id` - Получение пользователя по ID
- `POST /users` - Создание пользователя
- `PATCH /users/:id` - Обновление пользователя
- `DELETE /users/:id` - Удаление пользователя

### Задачи
- `GET /tasks` - Получение всех задач с фильтрацией
- `GET /tasks/:id` - Получение задачи по ID
- `POST /tasks` - Создание задачи
- `PATCH /tasks/:id` - Обновление задачи
- `DELETE /tasks/:id` - Удаление задачи

### Проекты
- `GET /projects` - Получение всех проектов
- `GET /projects/:id` - Получение проекта по ID
- `POST /projects` - Создание проекта
- `PATCH /projects/:id` - Обновление проекта
- `DELETE /projects/:id` - Удаление проекта

### Категории
- `GET /categories` - Получение всех категорий
- `GET /categories/:id` - Получение категории по ID
- `POST /categories` - Создание категории
- `PATCH /categories/:id` - Обновление категории
- `DELETE /categories/:id` - Удаление категории

## 🛡️ Безопасность

### Валидация данных
- Использование `class-validator` для валидации DTO
- Глобальная валидация через `ValidationPipe`
- Проверка типов данных и ограничений

### Хеширование паролей
- Использование bcrypt с 10 раундами соли
- Автоматическое хеширование при создании/обновлении пользователей

### CORS
- Настроен для работы с Quasar dev сервером
- Поддержка credentials для передачи токенов

## 🗄️ База данных

### Конфигурация
- **СУБД**: SQLite
- **Файл**: `./database.sqlite`
- **ORM**: Sequelize
- **Синхронизация**: Автоматическая (synchronize: true)

### Сидирование
- **Файл**: `database/seed.ts`
- **Назначение**: Заполнение базы данных начальными данными
- **Команда**: `npm run seed`

### Начальные данные
- Роли: admin, user, manager
- Пользователи: admin@example.com, user1@example.com, user2@example.com
- Категории: Баг, Функция, Улучшение
- Проекты: Основной проект, Тестовый проект

## 🚀 Запуск

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run start:dev
```

### Сидирование базы данных
```bash
npm run seed
```

### Сборка для продакшена
```bash
npm run build
npm run start:prod
```

## 🔧 Конфигурация

### Переменные окружения
- `PORT` - Порт сервера (по умолчанию 3001)
- `JWT_SECRET` - Секретный ключ для JWT токенов

### Настройки CORS
- Разрешенные origins: `http://localhost:9000`, `http://localhost:8080`
- Поддержка credentials: `true`

## 📝 Логирование

Система использует встроенное логирование NestJS:
- Логирование запросов и ответов
- Логирование ошибок валидации
- Логирование процесса аутентификации

## 🧪 Тестирование

### Структура тестов
- E2E тесты в папке `test/`
- Unit тесты рядом с тестируемыми файлами
- Использование Jest как тестового фреймворка

### Запуск тестов
```bash
npm run test
npm run test:e2e
```

## 🔄 Миграции

В текущей версии используется автоматическая синхронизация Sequelize. Для продакшена рекомендуется настроить миграции:

```bash
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli db:migrate
```

## 📈 Производительность

### Оптимизации
- Индексы на часто используемых полях
- Ленивая загрузка связей
- Пагинация для больших списков
- Кэширование JWT токенов

### Мониторинг
- Логирование времени выполнения запросов
- Отслеживание ошибок базы данных
- Мониторинг использования памяти

## 🔮 Планы развития

### Краткосрочные
- Добавление уведомлений
- Система комментариев с упоминаниями
- Экспорт данных в различных форматах

### Долгосрочные
- Микросервисная архитектура
- Поддержка PostgreSQL
- Система уведомлений в реальном времени
- API документация с Swagger

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
