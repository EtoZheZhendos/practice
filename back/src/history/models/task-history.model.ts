import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'task_history',
  timestamps: true,
})
export class TaskHistory extends Model {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  field: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  oldValue: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  newValue: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action: string;

  // Связи
  @BelongsTo(() => Task)
  task: Task;

  @BelongsTo(() => User)
  user: User;
} 