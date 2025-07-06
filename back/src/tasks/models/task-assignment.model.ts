import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Task } from './task.model';

@Table({
  tableName: 'task_assignments',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['taskId'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class TaskAssignment extends Model {
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
    type: DataType.ENUM('assigned', 'accepted', 'declined'),
    defaultValue: 'assigned',
  })
  status: 'assigned' | 'accepted' | 'declined';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  assignedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  acceptedAt: Date;

  // Связи
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Task)
  task: Task;
} 