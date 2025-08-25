import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard, Public } from '../shared/guards/auth.guard';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Get()
  @Public()
  findAll() {
    return this.profiles.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findById(@Param('id') id: string) {
    return this.profiles.findById(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateProfileDto) {
    return this.profiles.create(data);
  }
}
