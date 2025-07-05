import { User } from '../../users/models/user.model';
import { Role } from '../../roles/models/role.model';
import { UserRole } from '../../roles/models/user-role.model';
import { Category } from '../../categories/models/category.model';
import { Project } from '../../projects/models/project.model';

export async function seedInitialData() {
  // Создаем роли
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

  // Создаем пользователей
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

  // Связываем пользователей с ролями через UserRole
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

  // Создаем категории
  const bugCategory = await Category.create({
    name: 'Баг',
    description: 'Исправление ошибок',
    color: '#ff4444',
  });

  const featureCategory = await Category.create({
    name: 'Функция',
    description: 'Новые возможности',
    color: '#44ff44',
  });

  const improvementCategory = await Category.create({
    name: 'Улучшение',
    description: 'Улучшение существующего',
    color: '#4444ff',
  });

  // Создаем проекты
  const mainProject = await Project.create({
    name: 'Основной проект',
    description: 'Главный проект системы',
    status: 'active',
    color: '#ff8800',
  });

  const testProject = await Project.create({
    name: 'Тестовый проект',
    description: 'Проект для тестирования',
    status: 'active',
    color: '#8800ff',
  });

  console.log('Initial data seeded successfully!');
} 