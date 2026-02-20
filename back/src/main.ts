import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime automatiquement les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: false, // Ne rejette pas la requête, supprime juste les propriétés
      transform: true, // Transforme automatiquement les payloads en instances DTO
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    // Autorise localhost:80 (production Docker/Nginx), localhost:5173 (dev vite) et localhost (sans port explicite)
    origin: ['http://localhost', 'http://localhost:5173', 'http://localhost:80'],
    credentials: true,
  });
  // Installe le middleware pour lire les cookies des requêtes
  app.use((cookieParser as unknown as () => unknown)() as any);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
