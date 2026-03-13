import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create <NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'https://olavarriaconecta.com',
      'https://www.olavarriaconecta.com',
      'http://localhost:5173' // Para que te siga funcionando en desarrollo
    ],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
  }
)

app.use(json({ limit: '50mb' })); 
  app.use(urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//fix para que se suba todo
