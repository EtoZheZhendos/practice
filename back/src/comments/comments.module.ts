import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';

@Module({
  imports: [SequelizeModule.forFeature([Comment])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommentsModule {} 