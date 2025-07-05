import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  task_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsOptional()
  parent_id?: number;
} 