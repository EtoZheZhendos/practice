export interface IRole {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IRoleWithRelations extends IRole {
  users?: any[];
}

export interface IRoleFilters {
  isActive?: boolean;
  search?: string;
} 