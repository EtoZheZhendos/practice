import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITaskFilters } from './interfaces/task.interface';
import { Op } from 'sequelize';
import { TaskAssignment } from './models/task-assignment.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = await this.taskModel.create({
      ...createTaskDto,
      createdById: userId,
    });

    // Добавляем назначения
    if (createTaskDto.assigneeIds && Array.isArray(createTaskDto.assigneeIds)) {
      for (const assigneeId of createTaskDto.assigneeIds) {
        const assignment = await TaskAssignment.create({
          taskId: task.id,
          userId: assigneeId,
          status: 'assigned',
          assignedAt: new Date(),
        });
        console.log('TaskAssignment created:', assignment.toJSON());
      }
    }

    // Здесь можно добавить логику для связей с категориями, проектами и назначениями
    return task;
  }

  async findAll(filters: ITaskFilters = {}): Promise<Task[]> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) {
        where.dueDate[Op.gte] = filters.dueDateFrom;
      }
      if (filters.dueDateTo) {
        where.dueDate[Op.lte] = filters.dueDateTo;
      }
    }

    return this.taskModel.findAll({
      where,
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
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: [
        { association: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { association: 'categories' },
        { 
          association: 'assignments',
          include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
        { association: 'comments' },
        { association: 'projects' },
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    await task.update(updateTaskDto);

    // Обновляем назначения
    if (updateTaskDto.assigneeIds !== undefined) {
      // Удаляем все существующие назначения
      await TaskAssignment.destroy({ where: { taskId: id } });
      
      // Добавляем новые назначения
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

    // Обновляем связи с категориями
    if (updateTaskDto.categoryIds !== undefined) {
      await task.$set('categories', updateTaskDto.categoryIds || []);
    }

    // Обновляем связи с проектами
    if (updateTaskDto.projectIds !== undefined) {
      await task.$set('projects', updateTaskDto.projectIds || []);
    }

    // Возвращаем обновленную задачу с включенными связями
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

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

  async findAssignedToUser(userId: number): Promise<Task[]> {
    const assignments = await TaskAssignment.findAll({ where: { userId }, paranoid: false });
    console.log('Assignments for user', userId, assignments.map(a => a.toJSON()));
    const taskIds = assignments.map(a => a.taskId);
    if (!taskIds.length) return [];
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