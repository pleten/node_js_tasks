import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  /* Swagger */
  const swaggerCfg = new DocumentBuilder()
    .setTitle('Nest Demo API')
    .setDescription('Mini-проєкт Nest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  logger.log(`Swagger docs available at http://localhost:${port}/docs`);

  await app.listen(port);
  app.enableShutdownHooks();
}
bootstrap();
