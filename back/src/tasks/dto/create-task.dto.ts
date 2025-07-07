/**
 * DTO для создания задачи
 * Определяет структуру данных, необходимых для создания новой задачи
 * 
 * @author TaskManager Team
 * @version 1.0.0
 */

import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';

/**
 * Data Transfer Object для создания задачи
 * Содержит валидацию полей с помощью class-validator
 * 
 * @example
 * {
 *   "title": "Создать новый функционал",
 *   "description": "Реализовать систему уведомлений",
 *   "status": "pending",
 *   "dueDate": "2024-12-31T23:59:59.000Z",
 *   "priority": 3,
 *   "categoryIds": [1, 2],
 *   "projectIds": [1],
 *   "assigneeIds": [2, 3]
 * }
 */
export class CreateTaskDto {
  /**
   * Название задачи
   * Обязательное поле, должно быть строкой
   * Краткое описание того, что нужно сделать
   */
  @IsString()
  title: string;

  /**
   * Подробное описание задачи
   * Необязательное поле
   * Может содержать детальную информацию о требованиях
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Статус задачи
   * Необязательное поле, по умолчанию 'pending'
   * Допустимые значения: pending, in_progress, completed
   */
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: 'pending' | 'in_progress' | 'completed';

  /**
   * Дата выполнения задачи
   * Необязательное поле
   * Должна быть валидной датой в формате ISO 8601
   */
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  /**
   * Приоритет задачи
   * Необязательное поле, целое число от 1 до 5
   * 1 - самый низкий приоритет, 5 - самый высокий
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;

  /**
   * Массив ID категорий
   * Необязательное поле
   * Содержит ID категорий, к которым относится задача
   * Каждый элемент должен быть целым числом
   */
  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  /**
   * Массив ID проектов
   * Необязательное поле
   * Содержит ID проектов, к которым относится задача
   * Каждый элемент должен быть целым числом
   */
  @IsOptional()
  @IsInt({ each: true })
  projectIds?: number[];

  /**
   * Массив ID назначенных пользователей
   * Необязательное поле
   * Содержит ID пользователей, которым назначена задача
   * Каждый элемент должен быть целым числом
   */
  @IsOptional()
  @IsInt({ each: true })
  assigneeIds?: number[];
} 