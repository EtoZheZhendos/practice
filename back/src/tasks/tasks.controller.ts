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

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // TODO: Добавить JWT guard и получить userId из токена
    const userId = 1; // Временно хардкодим
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Query() filters: ITaskFilters) {
    return this.tasksService.findAll(filters);
  }

  @Get('my')
  findMyTasks(@Request() req) {
    // TODO: Добавить JWT guard и получить userId из токена
    const userId = 1; // Временно хардкодим
    return this.tasksService.findByUser(userId);
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