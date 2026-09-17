import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  // rawBody: true est indispensable pour la vérification de signature des webhooks
  // (Wave signe le corps brut octet pour octet — un JSON reparsé casserait la signature)
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.use(helmet());

  // Validation automatique des DTOs sur toutes les routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans le DTO (sécurité)
      forbidNonWhitelisted: true, // rejette la requête si des champs inconnus sont envoyés
      transform: true, // transforme automatiquement les payloads en instances de classe
    }),
  );

  // Autorise uniquement le frontend à appeler l'API
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend démarré sur http://localhost:${port}/api`);
}
bootstrap();
