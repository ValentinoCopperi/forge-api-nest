import { NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { RequestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { RateLimitMiddleware } from './shared/middlewares/rate-limit.middleware';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

const GLOBAL_PREFIX = '/api/v1';


async function bootstrap() {


  const app = await NestFactory.create<NestApplication>(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useBodyParser('json', { limit: '10mb' });

  const requestIdMiddleware = app.get(RequestIdMiddleware);
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware));

  const loggerMiddleware = app.get(LoggerMiddleware);
  app.use(loggerMiddleware.use.bind(loggerMiddleware));

  const rateLimitMiddleware = app.get(RateLimitMiddleware);
  app.use(rateLimitMiddleware.use.bind(rateLimitMiddleware));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  const config = new DocumentBuilder()
    .setTitle('Forge-api-nest')
    .setDescription('Forge API Nest')
    .setVersion('1.0')
    .addTag('Forge')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);
}
bootstrap();
