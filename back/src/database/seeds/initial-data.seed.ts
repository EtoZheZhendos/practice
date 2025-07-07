/**
 * Начальные данные для базы данных
 * Создает базовые роли, пользователей, категории и проекты для системы
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { User } from '../../users/models/user.model';
import { Role } from '../../roles/models/role.model';
import { UserRole } from '../../roles/models/user-role.model';
import { Category } from '../../categories/models/category.model';
import { Project } from '../../projects/models/project.model';

/**
 * Функция заполнения базы данных начальными данными
 * Создает структуру ролей, пользователей, категорий и проектов
 * Используется для инициализации системы и тестирования
 */
export async function seedInitialData() {
  console.log('📝 Creating roles...');
  
  // Создание ролей пользователей
  const adminRole = await Role.create({
    name: 'admin',
    description: 'Администратор системы',
  });

  const userRole = await Role.create({
    name: 'user',
    description: 'Обычный пользователь',
  });

  const managerRole = await Role.create({
    name: 'manager',
    description: 'Менеджер проекта',
  });

  console.log('👥 Creating users...');
  
  // Создание тестовых пользователей
  // Пароль для всех пользователей: password123 (хешированный)
  const admin = await User.create({
    email: 'admin@example.com',
    password: '$2b$10$9Ko1VMV36UFnvHuzDszq3.oxvBJ7i8/5YrBftfQgwudBMrnzK01Hi', // password123
    firstName: 'Админ',
    lastName: 'Системы',
  });

  const user1 = await User.create({
    email: 'user1@example.com',
    password: '$2b$10$9Ko1VMV36UFnvHuzDszq3.oxvBJ7i8/5YrBftfQgwudBMrnzK01Hi', // password123
    firstName: 'Иван',
    lastName: 'Иванов',
  });

  const user2 = await User.create({
    email: 'user2@example.com',
    password: '$2b$10$9Ko1VMV36UFnvHuzDszq3.oxvBJ7i8/5YrBftfQgwudBMrnzK01Hi', // password123
    firstName: 'Петр',
    lastName: 'Петров',
  });

  console.log('🔗 Assigning roles to users...');
  
  // Назначение ролей пользователям через промежуточную таблицу UserRole
  await UserRole.create({
    userId: admin.id,
    roleId: adminRole.id,
    assignedAt: new Date(),
  });

  await UserRole.create({
    userId: user1.id,
    roleId: userRole.id,
    assignedAt: new Date(),
  });

  await UserRole.create({
    userId: user2.id,
    roleId: userRole.id,
    assignedAt: new Date(),
  });

  console.log('🏷️ Creating categories...');
  
  // Создание категорий для задач
  const bugCategory = await Category.create({
    name: 'Баг',
    description: 'Исправление ошибок',
    color: '#ff4444',  // Красный цвет для багов
  });

  const featureCategory = await Category.create({
    name: 'Функция',
    description: 'Новые возможности',
    color: '#44ff44',  // Зеленый цвет для новых функций
  });

  const improvementCategory = await Category.create({
    name: 'Улучшение',
    description: 'Улучшение существующего',
    color: '#4444ff',  // Синий цвет для улучшений
  });

  console.log('📋 Creating projects...');
  
  // Создание проектов
  const mainProject = await Project.create({
    name: 'Основной проект',
    description: 'Главный проект системы',
    status: 'active',
    color: '#ff8800',  // Оранжевый цвет
  });

  const testProject = await Project.create({
    name: 'Тестовый проект',
    description: 'Проект для тестирования',
    status: 'active',
    color: '#8800ff',  // Фиолетовый цвет
  });

  console.log('✅ Initial data seeded successfully!');
  console.log('📊 Created:');
  console.log(`   - ${await Role.count()} roles`);
  console.log(`   - ${await User.count()} users`);
  console.log(`   - ${await Category.count()} categories`);
  console.log(`   - ${await Project.count()} projects`);
} 