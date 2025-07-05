import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './models/project.model';
import { TaskProject } from './models/task-project.model';

@Module({
  imports: [SequelizeModule.forFeature([Project, TaskProject])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProjectsModule {} 