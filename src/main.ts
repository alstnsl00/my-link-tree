import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('my-link-tree')
    .setDescription('linkTree (Backend)')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
