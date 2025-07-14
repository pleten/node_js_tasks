import { Module } from '../core';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [TemplateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
