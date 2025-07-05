import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { Project } from './project.model';

@Table({
  tableName: 'task_projects',
  timestamps: true,
})
export class TaskProject extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  taskId: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectId: number;
} 