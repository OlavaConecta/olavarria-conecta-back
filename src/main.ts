import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create <NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'https://olavarriaconecta.com',
      'https://www.olavarriaconecta.com',
      'http://localhost:5173' // Para que te siga funcionando en desarrollo
    ],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true,
  }
)
app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // ESTO es lo que hace que el planId pase de "1" a 1
  }));
app.use(json({ limit: '50mb' })); 
  app.use(urlencoded({ limit: '50mb', extended: true }));

//esto sirve para las migraciones de base de datos
try {
    const dataSource = app.get(DataSource);
    await dataSource.runMigrations();
    console.log('🚀 Migraciones ejecutadas con éxito en producción');
  } catch (error) {
    console.error('❌ Error al ejecutar las migraciones automáticamente:', error);
  }



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//fix para que se suba todo
