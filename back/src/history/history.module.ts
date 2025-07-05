import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskHistory } from './models/task-history.model';

@Module({
  imports: [SequelizeModule.forFeature([TaskHistory])],
  controllers: [],
  providers: [],
  exports: [],
})
export class HistoryModule {} 