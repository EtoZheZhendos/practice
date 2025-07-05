import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskHistory } from './models/task-history.model';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
  imports: [SequelizeModule.forFeature([TaskHistory])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService, SequelizeModule],
})
export class HistoryModule {} 