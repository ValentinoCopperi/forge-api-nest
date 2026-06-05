import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { LoggerMiddleware } from 'src/shared/middlewares/logger.middleware';
import { TokenMiddleware } from 'src/shared/middlewares/token.middleware';
import { CreateTaskCron } from './jobs/create-task.cron';

@Module({
  controllers: [TasksController],
  providers: [TasksService, CreateTaskCron],
})
export class TasksModule implements NestModule {
  //Manera de aplicar Middlewares a nivel Module.
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware,TokenMiddleware)
      .forRoutes(TasksController);
  }
} 
