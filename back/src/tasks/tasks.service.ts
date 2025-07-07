/**
 * Сервис для работы с задачами
 * Обеспечивает CRUD операции для задач и управление связями
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITaskFilters } from './interfaces/task.interface';
import { Op } from 'sequelize';
import { TaskAssignment } from './models/task-assignment.model';

/**
 * Сервис для управления задачами
 * Включает создание, чтение, обновление, удаление задач
 * и управление связями с пользователями, категориями и проектами
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,  // Модель задачи из Sequelize
  ) {}

  /**
   * Создание новой задачи
   * Создает задачу и устанавливает связи с назначенными пользователями
   * 
   * @param createTaskDto - Данные для создания задачи
   * @param userId - ID пользователя, создающего задачу
   * @returns Созданная задача
   */
  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Создание основной записи задачи
    const task = await this.taskModel.create({
      ...createTaskDto,
      createdById: userId,  // Установка создателя задачи
    });

    // Создание назначений пользователей на задачу
    if (createTaskDto.assigneeIds && Array.isArray(createTaskDto.assigneeIds)) {
      for (const assigneeId of createTaskDto.assigneeIds) {
        const assignment = await TaskAssignment.create({
          taskId: task.id,
          userId: assigneeId,
          status: 'assigned',      // Статус назначения
          assignedAt: new Date(),  // Дата назначения
        });
        console.log('TaskAssignment created:', assignment.toJSON());
      }
    }

    // TODO: Добавить логику для связей с категориями и проектами
    return task;
  }

  /**
   * Получение всех задач с фильтрацией
   * Поддерживает фильтрацию по статусу, приоритету, создателю, поиску и датам
   * 
   * @param filters - Объект с параметрами фильтрации
   * @returns Массив задач с включенными связями
   */
  async findAll(filters: ITaskFilters = {}): Promise<Task[]> {
    const where: any = {};

    // Фильтрация по статусу задачи
    if (filters.status) {
      where.status = filters.status;
    }

    // Фильтрация по приоритету
    if (filters.priority) {
      where.priority = filters.priority;
    }

    // Фильтрация по создателю задачи
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    // Поиск по названию и описанию задачи
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },      // Поиск в названии
        { description: { [Op.like]: `%${filters.search}%` } }, // Поиск в описании
      ];
    }

    // Фильтрация по диапазону дат выполнения
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) {
        where.dueDate[Op.gte] = filters.dueDateFrom;  // Больше или равно
      }
      if (filters.dueDateTo) {
        where.dueDate[Op.lte] = filters.dueDateTo;    // Меньше или равно
      }
    }

    // Получение задач с включенными связями
    return this.taskModel.findAll({
      where,
      include: [
        // Связь с создателем задачи
        { association: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        // Связь с категориями
        { association: 'categories' },
        // Связь с назначениями и пользователями
        { 
          association: 'assignments',
          include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
        // Связь с проектами
        { association: 'projects' },
      ],
      order: [['createdAt', 'DESC']],  // Сортировка по дате создания (новые сначала)
    });
  }

  /**
   * Получение задачи по ID
   * Включает все связанные данные: создателя, категории, назначения, комментарии, проекты
   * 
   * @param id - ID задачи
   * @returns Задача с полными данными
   * @throws NotFoundException если задача не найдена
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: [
        // Связь с создателем задачи
        { association: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        // Связь с категориями
        { association: 'categories' },
        // Связь с назначениями и назначенными пользователями
        { 
          association: 'assignments',
          include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
        // Связь с комментариями
        { association: 'comments' },
        // Связь с проектами
        { association: 'projects' },
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Обновление задачи
   * Обновляет основные данные задачи и управляет связями
   * 
   * @param id - ID задачи для обновления
   * @param updateTaskDto - Данные для обновления
   * @returns Обновленная задача
   */
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Получение существующей задачи
    const task = await this.findOne(id);
    
    // Обновление основных полей задачи
    await task.update(updateTaskDto);

    // Обновление назначений пользователей
    if (updateTaskDto.assigneeIds !== undefined) {
      // Удаление всех существующих назначений
      await TaskAssignment.destroy({ where: { taskId: id } });
      
      // Создание новых назначений
      if (Array.isArray(updateTaskDto.assigneeIds)) {
        for (const assigneeId of updateTaskDto.assigneeIds) {
          await TaskAssignment.create({
            taskId: id,
            userId: assigneeId,
            status: 'assigned',
            assignedAt: new Date(),
          });
        }
      }
    }

    // Обновление связей с категориями
    if (updateTaskDto.categoryIds !== undefined) {
      await task.$set('categories', updateTaskDto.categoryIds || []);
    }

    // Обновление связей с проектами
    if (updateTaskDto.projectIds !== undefined) {
      await task.$set('projects', updateTaskDto.projectIds || []);
    }

    // Возврат обновленной задачи с включенными связями
    return this.findOne(id);
  }

  /**
   * Удаление задачи
   * Удаляет задачу и все связанные с ней данные
   * 
   * @param id - ID задачи для удаления
   */
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

  /**
   * Получение задач, созданных пользователем
   * 
   * @param userId - ID пользователя
   * @returns Массив задач, созданных пользователем
   */
  async findByUser(userId: number): Promise<Task[]> {
    return this.taskModel.findAll({
      where: { createdById: userId },
      include: [
        { association: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { association: 'categories' },
        { 
          association: 'assignments',
          include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Получение задач, назначенных пользователю
   * Находит все назначения пользователя и возвращает соответствующие задачи
   * 
   * @param userId - ID пользователя
   * @returns Массив задач, назначенных пользователю
   */
  async findAssignedToUser(userId: number): Promise<Task[]> {
    // Поиск всех назначений пользователя (включая удаленные)
    const assignments = await TaskAssignment.findAll({ where: { userId }, paranoid: false });
    console.log('Assignments for user', userId, assignments.map(a => a.toJSON()));
    
    // Извлечение ID задач из назначений
    const taskIds = assignments.map(a => a.taskId);
    if (!taskIds.length) return [];
    
    // Получение задач по найденным ID
    const tasks = await this.taskModel.findAll({
      where: { id: taskIds },
      include: [
        { association: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { association: 'categories' },
        { 
          association: 'assignments',
          include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
        { association: 'projects' },
      ],
      order: [['createdAt', 'DESC']],
    });
    console.log('Tasks found for assignments:', tasks.map(t => t.toJSON()));
    return tasks;
  }
} 