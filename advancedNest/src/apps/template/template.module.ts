import { Module } from '../../core';

import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [],
})
export class TemplateModule {}
