import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  private profiles: Profile[] = [];

  findAll(): Profile[] {
    return this.profiles;
  }

  findById(id: number): Profile {
    const profile = this.profiles.find((t) => t.id === id);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  create(data: CreateProfileDto): Profile {
    if (this.profiles.some((item) => item.email === data.email)) {
      throw new BadRequestException('Email is already registered');
    }
    const profile: Profile = { id: Date.now(), ...data };
    this.profiles.push(profile);
    return profile;
  }
}
