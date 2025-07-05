import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITaskFilters } from './interfaces/task.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.userId;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Query() filters: ITaskFilters) {
    return this.tasksService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyTasks(@Request() req) {
    const userId = req.user.userId;
    return this.tasksService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assigned')
  findAssignedTasks(@Request() req) {
    const userId = req.user.userId;
    return this.tasksService.findAssignedToUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
} 