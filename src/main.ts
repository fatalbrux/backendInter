import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //habilitando VALIDACION con class-validation
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  //habilitando swagger

  const config = new DocumentBuilder()
  .setTitle("Sistema Backend Internet")
  .setDescription("Este backend es el de un sistema de cobros de internet")
  .setVersion("1.0")
  .addTag("Backend Nest")
  .addBearerAuth()
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
