import { Column, DataType, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { UserRole } from './user-role.model';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['name'],
    },
    {
      fields: ['isActive'],
    },
  ],
})
export class Role extends Model {
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
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  // Связи
  @BelongsToMany(() => User, () => UserRole)
  users: User[];
} 