import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './models/task.model';
import { TaskAssignment } from './models/task-assignment.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Task, TaskAssignment])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {} 