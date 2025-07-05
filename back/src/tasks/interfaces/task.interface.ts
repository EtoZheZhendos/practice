export interface ITask {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  priority: number;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ITaskWithRelations extends ITask {
  createdBy?: any;
  categories?: any[];
  assignments?: any[];
  comments?: any[];
  projects?: any[];
}

export interface ITaskFilters {
  status?: string;
  priority?: number;
  createdById?: number;
  assigneeId?: number;
  categoryId?: number;
  projectId?: number;
  search?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
} 