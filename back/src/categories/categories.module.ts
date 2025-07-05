import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { TaskCategory } from './models/task-category.model';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [SequelizeModule.forFeature([Category, TaskCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, SequelizeModule],
})
export class CategoriesModule {} 