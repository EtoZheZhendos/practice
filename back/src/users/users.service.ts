/**
 * Сервис для работы с пользователями
 * Обеспечивает CRUD операции для пользователей и управление профилями
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserFilters } from './interfaces/user.interface';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

/**
 * Сервис для управления пользователями
 * Включает создание, чтение, обновление, удаление пользователей
 * и управление их ролями и активностью
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,  // Модель пользователя из Sequelize
  ) {}

  /**
   * Создание нового пользователя
   * Проверяет уникальность email и хеширует пароль
   * 
   * @param createUserDto - Данные для создания пользователя
   * @returns Созданный пользователь
   * @throws ConflictException если пользователь с таким email уже существует
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Проверка существования пользователя с таким email
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хеширование пароля с солью (10 раундов)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Создание пользователя с хешированным паролем
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * Получение всех пользователей с фильтрацией
   * Поддерживает фильтрацию по активности и поиск по имени, фамилии, email
   * 
   * @param filters - Объект с параметрами фильтрации
   * @returns Массив пользователей с включенными связями
   */
  async findAll(filters: IUserFilters = {}): Promise<User[]> {
    const where: any = {};

    // Фильтрация по активности пользователя
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Поиск по имени, фамилии или email
    if (filters.search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${filters.search}%` } },  // Поиск в имени
        { lastName: { [Op.like]: `%${filters.search}%` } },   // Поиск в фамилии
        { email: { [Op.like]: `%${filters.search}%` } },      // Поиск в email
      ];
    }

    // Получение пользователей с включенными связями
    return this.userModel.findAll({
      where,
      include: [
        { association: 'roles' },           // Роли пользователя
        { association: 'createdTasks' },    // Задачи, созданные пользователем
        { association: 'taskAssignments' }, // Назначения пользователя
      ],
      order: [['createdAt', 'DESC']],       // Сортировка по дате создания
    });
  }

  /**
   * Получение пользователя по ID
   * Включает все связанные данные: роли, созданные задачи, назначения, комментарии
   * 
   * @param id - ID пользователя
   * @returns Пользователь с полными данными
   * @throws NotFoundException если пользователь не найден
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: [
        { association: 'roles' },           // Роли пользователя
        { association: 'createdTasks' },    // Задачи, созданные пользователем
        { association: 'taskAssignments' }, // Назначения пользователя
        { association: 'comments' },        // Комментарии пользователя
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Поиск пользователя по email
   * Используется для аутентификации и проверки уникальности
   * 
   * @param email - Email пользователя
   * @returns Пользователь с ролями или null если не найден
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [{ association: 'roles' }],  // Включаем роли для аутентификации
    });
  }

  /**
   * Обновление данных пользователя
   * Проверяет уникальность email и хеширует новый пароль при необходимости
   * 
   * @param id - ID пользователя для обновления
   * @param updateUserDto - Данные для обновления
   * @returns Обновленный пользователь
   * @throws ConflictException если email уже занят другим пользователем
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Получение существующего пользователя
    const user = await this.findOne(id);

    // Проверка уникальности email при изменении
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Хеширование нового пароля при изменении
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Обновление данных пользователя
    await user.update(updateUserDto);
    return user;
  }

  /**
   * Удаление пользователя
   * Удаляет пользователя и все связанные с ним данные
   * 
   * @param id - ID пользователя для удаления
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  /**
   * Обновление времени последнего входа
   * Используется для отслеживания активности пользователей
   * 
   * @param id - ID пользователя
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userModel.update(
      { lastLoginAt: new Date() },  // Установка текущего времени
      { where: { id } },
    );
  }
} 