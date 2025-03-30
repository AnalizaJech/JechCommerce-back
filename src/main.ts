import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppDataSource } from './data-source';

// Cargar variables desde .env.production siempre
dotenv.config({
  path: path.resolve(process.cwd(), `.env.production`),
});

async function bootstrap() {
  // Inicializar conexión con Render (sin synchronize)
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado a PostgreSQL en Render correctamente');
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos de Render:', err);
    process.exit(1); // 🔴 Si falla la conexión, salimos del proceso
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('JechCommerce API')
    .setDescription('Documentación interactiva de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
