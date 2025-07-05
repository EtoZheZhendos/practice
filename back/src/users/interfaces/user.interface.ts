export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IUserWithRelations extends IUser {
  roles?: any[];
  createdTasks?: any[];
  taskAssignments?: any[];
  comments?: any[];
}

export interface IUserFilters {
  isActive?: boolean;
  search?: string;
  roleId?: number;
} 