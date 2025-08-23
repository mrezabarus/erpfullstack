import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Whitelist origin
  const allowedOrigins = [
    'http://localhost:3000',                 // local dev
    'https://erpfrontend-fawn.vercel.app',   // frontend Vercel
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
