import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/modules/auth/decorators';
import { ResponseInterceptor } from '@/shared/interceptors';
import { CreateTaskDto, createTaskSchema } from '@/modules/tasks/dto';
import { ZodValidationPipe } from '@/modules/tasks/pipes';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Public()
  getTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  @UseInterceptors(ResponseInterceptor)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask({ title: createTaskDto.title, userId: 1 });
  }
}
