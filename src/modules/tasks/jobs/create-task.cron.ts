import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '../tasks.service';

@Injectable()
export class CreateTaskCron {
  constructor(private readonly tasksService: TasksService) {}
}
