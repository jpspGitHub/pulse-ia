import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  });

  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(env.PORT);
  console.log(`API listening on http://localhost:${env.PORT}`);
}

bootstrap();
