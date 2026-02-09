import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
  console.log(`Worker health listening on http://localhost:${env.PORT}/health`);
}

bootstrap();
