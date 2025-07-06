import { Module } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';

@Module({
  imports: [],
  controllers: [TeaController],
  providers: [TeaService],
  exports: [TeaService],
})
export class TeaModule {}
