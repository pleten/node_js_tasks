import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.listen(process.env.PORT ?? 3000);
  app.enableShutdownHooks();
}
bootstrap();
