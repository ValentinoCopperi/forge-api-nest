import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule, authConfig } from '@/modules/auth';
import {
  HealthModule,
  OrganizationsModule,
  ProjectsModule,
  TasksModule,
  UsersModule,
} from '@/modules';
import {
  CatchEverythingFilter,
  envValidationSchema,
  LoggerModule,
  PrismaModule,
  RateLimitMiddleware,
  ResponseInterceptor,
} from '@/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [authConfig],
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
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
