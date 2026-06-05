import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CatchEverythingFilter } from './shared/exceptions/exception.filter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { envValidationSchema } from './shared/config/env.validation';
import { LoggerModule } from './shared/logger/logger.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimitMiddleware } from './shared/middlewares/rate-limit.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('IP_REQUEST_TTL', 60000),
            limit: configService.get<number>('MAX_IP_REQUEST', 10),
          },
        ],
      }),
    }),
    CacheModule.register(),
    LoggerModule,
    PrismaModule,
    HealthModule,
    TasksModule,
    AuthModule,
    ScheduleModule.forRoot(),
    OrganizationsModule,
    UsersModule,
    ProjectsModule,
  ],
  providers: [
    RateLimitMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
