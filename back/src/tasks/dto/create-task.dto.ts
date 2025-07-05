import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: 'pending' | 'in_progress' | 'completed';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  projectIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  assigneeIds?: number[];
} 