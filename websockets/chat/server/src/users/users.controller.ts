import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {UserDTO} from "../dto";
import {Store} from "../store/store";
import {v4 as uuidv4} from 'uuid';

@Controller('/api/users')
export class UsersController {
  constructor(private store: Store) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async createUser(
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<UserDTO> {
    const user = await this.store.getUserByName(name);
    if (user) {
      return user;
    }
    const iconUrl = await this.store.createIcon(name, icon);
    const id = uuidv4();
    return this.store.addUser({
        id,
        name,
        iconUrl,
    })
  }

  @Get()
  async list(): Promise<{ items: UserDTO[]; total: number }> {
    const users = await this.store.getUsers();
    return {
      items: users,
      total: users.length
    }
  }

  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
    const image = await this.store.getIcon(iconPath);

    res.header({'Content-Type': `image/${iconPath.split('.').pop()}`}).send(image)
  }
}
