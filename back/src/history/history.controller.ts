import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('task_id') taskId?: string) {
    if (taskId) {
      return this.historyService.findByTask(+taskId);
    }
    return this.historyService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(+id);
  }
} 