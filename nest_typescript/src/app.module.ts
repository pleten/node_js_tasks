import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { TeaController } from './tea/tea.controller';
import { TeaModule } from './tea/tea.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { AppService } from './app.service';

@Module({
  imports: [TeaModule],
  controllers: [TeaController],
  providers: [Logger, AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
