import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Role } from './role.model';

@Table({
  tableName: 'user_roles',
  timestamps: true,
})
export class UserRole extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  assignedAt: Date;
} 