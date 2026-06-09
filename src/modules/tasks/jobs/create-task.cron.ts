  import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks.service';

@Injectable()
export class CreateTaskCron {
  constructor(private readonly tasksService: TasksService) {}
}
