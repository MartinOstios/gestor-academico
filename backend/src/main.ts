import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:4200', // URL del frontend de Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no decoradas
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no decoradas
    transform: true, // Transforma los datos según los tipos
    transformOptions: {
      enableImplicitConversion: true, // Permite conversiones implícitas
    },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
