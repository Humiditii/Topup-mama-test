import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  const configService  = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle('Topup-Mama')
    .setDescription('Endpoint documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(+configService.get('SERVER_PORT'), ()=> console.log());
}
bootstrap();
