import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './models/project.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectModel.create(createProjectDto as any);
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectModel.findOne({
      where: { id, deletedAt: null },
    });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    await project.update(updateProjectDto);
    return project;
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await project.update({ deletedAt: new Date() });
  }
} 