import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    exposedHeaders: 'set-cookie',
    origin: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
