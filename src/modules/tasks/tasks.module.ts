import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, TokenMiddleware } from '@/shared/middlewares';
import { CreateTaskCron } from '@/modules/tasks/jobs';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, CreateTaskCron],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, TokenMiddleware)
      .forRoutes(TasksController);
  }
}
