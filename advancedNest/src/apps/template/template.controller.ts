import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  UseGuards,
} from '../../core';

import { TemplateService } from './template.service';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { templateSchema } from './dtl/template.schema';
import { IdToNumberPipe } from '../pipes/paramToId.pipe';
// import {booksSchema} from "./books.schema";
import { Roles, RolesGuard } from '../guards/roles.guard';

@Controller('/temp')
@UseGuards(RolesGuard) // застосовуємо глобально до всіх методів контролера
export class TemplateController {
  constructor(private svc: TemplateService) {}

  @Get('/')
  // @Roles('admin')
  list(@Query('minRating', UsePipes(new IdToNumberPipe())) minRating?: number) {
    return this.svc.findAll({ minRating });
  }

  @Get('/:id')
  one(@Param('id', UsePipes(new IdToNumberPipe())) id: number) {
    return this.svc.findOne(id);
  }

  @Post('/')
  @Roles('admin')
  @UsePipes(new ZodValidationPipe(templateSchema))
  add(@Body() body: { name: string }) {
    return this.svc.create(body.name);
  }
}
