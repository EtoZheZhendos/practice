import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './models/project.model';
import { TaskProject } from './models/task-project.model';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [SequelizeModule.forFeature([Project, TaskProject])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, SequelizeModule],
})
export class ProjectsModule {} 