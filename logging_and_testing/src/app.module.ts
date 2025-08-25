import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [ProfileModule],
  controllers: [ProfileController],
  providers: [ProfileService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
