/**
 * Модель задачи (Task)
 * Определяет структуру и связи таблицы задач в базе данных
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Category } from '../../categories/models/category.model';
import { TaskCategory } from '../../categories/models/task-category.model';
import { TaskAssignment } from './task-assignment.model';
import { Comment } from '../../comments/models/comment.model';
import { Project } from '../../projects/models/project.model';
import { TaskProject } from '../../projects/models/task-project.model';

/**
 * Модель задачи
 * Центральная сущность системы управления задачами
 * Содержит основную информацию о задаче и связи с другими сущностями
 */
@Table({
  tableName: 'tasks',        // Имя таблицы в базе данных
  timestamps: true,          // Автоматическое управление createdAt и updatedAt
  paranoid: true,            // Мягкое удаление (soft delete) - записи не удаляются физически
  indexes: [
    {
      fields: ['status'],     // Индекс для быстрого поиска по статусу
    },
    {
      fields: ['priority'],   // Индекс для быстрого поиска по приоритету
    },
    {
      fields: ['createdById'], // Индекс для быстрого поиска по создателю
    },
    {
      fields: ['dueDate'],    // Индекс для быстрого поиска по дате выполнения
    },
  ],
})
export class Task extends Model {
  /**
   * Уникальный идентификатор задачи
   * Автоинкрементное целое число
   */
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  /**
   * Название задачи
   * Обязательное поле, строка
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  /**
   * Описание задачи
   * Необязательное поле, текстовый тип для длинных описаний
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  /**
   * Статус задачи
   * Перечисление с предопределенными значениями
   * pending - ожидает выполнения
   * in_progress - в процессе выполнения
   * completed - завершена
   */
  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',  // По умолчанию задача создается со статусом "ожидает"
  })
  status: 'pending' | 'in_progress' | 'completed';

  /**
   * Дата выполнения задачи
   * Необязательное поле, используется для планирования
   */
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate: Date;

  /**
   * Приоритет задачи
   * Целое число, по умолчанию 1
   * Чем больше число, тем выше приоритет
   */
  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  priority: number;

  /**
   * Внешний ключ на пользователя-создателя задачи
   * Обязательное поле, связывает задачу с пользователем
   */
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdById: number;

  // ===== СВЯЗИ С ДРУГИМИ МОДЕЛЯМИ =====

  /**
   * Связь "принадлежит" с пользователем-создателем
   * Каждая задача принадлежит одному пользователю
   */
  @BelongsTo(() => User, 'createdById')
  createdBy: User;

  /**
   * Связь "многие ко многим" с категориями
   * Задача может принадлежать нескольким категориям
   * Использует промежуточную таблицу TaskCategory
   */
  @BelongsToMany(() => Category, () => TaskCategory)
  categories: Category[];

  /**
   * Связь "один ко многим" с назначениями
   * Задача может быть назначена нескольким пользователям
   */
  @HasMany(() => TaskAssignment)
  assignments: TaskAssignment[];

  /**
   * Связь "один ко многим" с комментариями
   * Задача может иметь несколько комментариев
   */
  @HasMany(() => Comment)
  comments: Comment[];

  /**
   * Связь "многие ко многим" с проектами
   * Задача может принадлежать нескольким проектам
   * Использует промежуточную таблицу TaskProject
   */
  @BelongsToMany(() => Project, () => TaskProject)
  declare projects: Project[];
} 