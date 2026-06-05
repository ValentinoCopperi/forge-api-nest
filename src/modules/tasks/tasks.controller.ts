import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import {ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { Public } from 'src/modules/auth/decorators/public.decorator';

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
