import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [SequelizeModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, SequelizeModule],
})
export class CommentsModule {} 