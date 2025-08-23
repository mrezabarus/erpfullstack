import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Whitelist origin
  const allowedOrigins = [
    'http://localhost:3000',
    'https://erpfrontend-fawn.vercel.app',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // ✅ Fix untuk Render (proxy)
  app.set('trust proxy', 1); // sekarang valid karena pakai NestExpressApplication

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
