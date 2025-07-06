import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiHeaders } from '@nestjs/swagger';
import { TeaService } from './tea.service';
import { CreateTeaDto } from './dto/create-tea.dto';
import { TeaFilters } from './interfaces/tea-filters.type';
import { ApiKeyGuard, Public } from '../shared/guards/api-key.guard';

@ApiTags('teas')
@Controller('teas')
@UseGuards(ApiKeyGuard)
export class TeaController {
  constructor(private readonly teas: TeaService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'page', type: 'number', minimum: 1, required: false })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    minimum: 10,
    maximum: 100,
    required: false,
  })
  @ApiQuery({
    name: 'minRating',
    type: 'number',
    minimum: 1,
    maximum: 10,
    required: false,
  })
  findAll(@Query() params?: TeaFilters) {
    return this.teas.findAll(params);
  }

  @Get(':id')
  @ApiHeaders([{ name: 'x-api-key' }])
  findOne(@Param('id') id: string) {
    return this.teas.findOne(+id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiHeaders([{ name: 'x-api-key' }])
  create(@Body() data: CreateTeaDto) {
    return this.teas.create(data);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiHeaders([{ name: 'x-api-key' }])
  update(@Param('id') id: string) {
    this.teas.delete(+id);
    return { deleted: true };
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @ApiHeaders([{ name: 'x-api-key' }])
  remove(@Param('id') id: string, @Body() data: CreateTeaDto) {
    this.teas.update(+id, data);
    return { deleted: true };
  }
}
