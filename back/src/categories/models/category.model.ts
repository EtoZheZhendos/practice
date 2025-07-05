import { Column, DataType, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { TaskCategory } from './task-category.model';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  // Связи
  @BelongsToMany(() => Task, () => TaskCategory)
  tasks: Task[];
} 