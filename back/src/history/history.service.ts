import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TaskHistory } from './models/task-history.model';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(TaskHistory)
    private taskHistoryModel: typeof TaskHistory,
  ) {}

  async create(historyData: any): Promise<TaskHistory> {
    return this.taskHistoryModel.create(historyData);
  }

  async findByTask(taskId: number): Promise<TaskHistory[]> {
    return this.taskHistoryModel.findAll({
      where: { task_id: taskId },
      order: [['created_at', 'DESC']],
    });
  }

  async findAll(): Promise<TaskHistory[]> {
    return this.taskHistoryModel.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: number): Promise<TaskHistory> {
    const history = await this.taskHistoryModel.findByPk(id);
    if (!history) {
      throw new Error('History record not found');
    }
    return history;
  }
} 