import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import {
  LoggerMiddleware,
  RateLimitMiddleware,
  RequestIdMiddleware,
} from '@/shared';

const GLOBAL_PREFIX = '/api/v1';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true,
  });

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useBodyParser('json', { limit: '10mb' });

  const requestIdMiddleware = app.get(RequestIdMiddleware);
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware));

  const loggerMiddleware = app.get(LoggerMiddleware);
  app.use(loggerMiddleware.use.bind(loggerMiddleware));

  const rateLimitMiddleware = app.get(RateLimitMiddleware);
  app.use(rateLimitMiddleware.use.bind(rateLimitMiddleware));

  const port = configService.get<number>('APP_PORT', 3000);

  const config = new DocumentBuilder()
    .setTitle('Forge-api-nest')
    .setDescription('Forge API Nest')
    .setVersion('1.0')
    .addTag('Forge')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter access token from login/register',
      },
      'access-token',
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('docs', app, documentFactory, {
      jsonDocumentUrl: 'docs/openapi.json',
  });

  await app.listen(port);
}
bootstrap();
