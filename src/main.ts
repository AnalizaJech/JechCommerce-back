import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar validación automática para DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 2. Habilitar CORS para el frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Swagger para documentar tu API
  const config = new DocumentBuilder()
    .setTitle('JechCommerce API')
    .setDescription('Documentación interactiva de la API')
    .setVersion('1.0')
    .addBearerAuth() // permite autenticación con JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
