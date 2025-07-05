import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { TaskCategory } from './models/task-category.model';

@Module({
  imports: [SequelizeModule.forFeature([Category, TaskCategory])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CategoriesModule {} 