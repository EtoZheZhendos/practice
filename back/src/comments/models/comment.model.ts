import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Task } from '../../tasks/models/task.model';

@Table({
  tableName: 'comments',
  timestamps: true,
})
export class Comment extends Model {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isInternal: boolean;
} 