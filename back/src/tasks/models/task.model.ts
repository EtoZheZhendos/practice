import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Category } from '../../categories/models/category.model';
import { TaskCategory } from '../../categories/models/task-category.model';
import { TaskAssignment } from './task-assignment.model';
import { Comment } from '../../comments/models/comment.model';
import { Project } from '../../projects/models/project.model';
import { TaskProject } from '../../projects/models/task-project.model';

@Table({
  tableName: 'tasks',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['createdById'],
    },
    {
      fields: ['dueDate'],
    },
  ],
})
export class Task extends Model {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  })
  status: 'pending' | 'in_progress' | 'completed';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  priority: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdById: number;

  // Связи
  @BelongsTo(() => User, 'createdById')
  createdBy: User;

  @BelongsToMany(() => Category, () => TaskCategory)
  categories: Category[];

  @HasMany(() => TaskAssignment)
  assignments: TaskAssignment[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Project, () => TaskProject)
  declare projects: Project[];
} 