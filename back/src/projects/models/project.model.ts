import { Column, DataType, Model, Table, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { TaskProject } from './task-project.model';

@Table({
  tableName: 'projects',
  timestamps: true,
  paranoid: true,
})
export class Project extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM('active', 'completed', 'archived'),
    defaultValue: 'active',
  })
  status: 'active' | 'completed' | 'archived';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color: string;

  // Связи
  @BelongsToMany(() => Task, () => TaskProject)
  tasks: Task[];
} 