import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentModel.create(createCommentDto as any);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { deleted_at: null },
      order: [['created_at', 'DESC']],
    });
  }

  async findByTask(taskId: number): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { task_id: taskId, deleted_at: null },
      order: [['created_at', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentModel.findOne({
      where: { id, deleted_at: null },
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    await comment.update(updateCommentDto);
    return comment;
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await comment.update({ deleted_at: new Date() });
  }
} 