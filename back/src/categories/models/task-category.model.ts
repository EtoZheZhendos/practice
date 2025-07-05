import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { Category } from './category.model';

@Table({
  tableName: 'task_categories',
  timestamps: true,
})
export class TaskCategory extends Model {
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;
} 