import { Column, DataType, Model, Table, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
import { Role } from '../../roles/models/role.model';
import { UserRole } from '../../roles/models/user-role.model';
import { TaskAssignment } from '../../tasks/models/task-assignment.model';
import { Comment } from '../../comments/models/comment.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Добавляет deleted_at
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      fields: ['isActive'],
    },
  ],
})
export class User extends Model {
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
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLoginAt: Date;

  // Связи
  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @HasMany(() => Task, 'createdById')
  createdTasks: Task[];

  @HasMany(() => TaskAssignment)
  taskAssignments: TaskAssignment[];

  @HasMany(() => Comment)
  comments: Comment[];
} 