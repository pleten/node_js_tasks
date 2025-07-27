import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import {ChatDTO} from "../dto";
import Redis from "ioredis";
import {Store} from "../store/store";
import {v4 as uuidv4} from 'uuid';

@Controller('/api/chats')
export class ChatsController {
  constructor(
    private store: Store,
    private redis: Redis
  ) {}

  @Post()
  async create(
    @Headers('X-User') creator: string,
    @Body() body: { name?: string; members: string[] },
  ): Promise<ChatDTO> {

    const response = await this.store.createChat({
      id: uuidv4(),
      name: body.name || body.members.join(', '),
      members: [creator, ...body.members],
      updatedAt: new Date().toISOString()
    });
    this.redis.publish('chat-events', JSON.stringify({
      ev: 'chatCreated',
      data: response,
      chanels: response.members,
      meta: { local: false },
      src: ''
    }));

    return response;
  }

  @Get()
  async list(@Headers('X-User') user: string): Promise<{ items: ChatDTO[]; total: number }> {
    const chats = await this.store.getChatList(user);

    return {
        items: chats,
        total: chats.length,
    }
  }

  @Patch(':id/members')
  async patch(
    @Headers('X-User') actor: string,
    @Param('id') id: string,
    @Body() dto: { add?: string[]; remove?: string[] },
  ) {
    const chat = await this.store.getChatData(id);
    const response = await this.store.updateChatMembers(id, actor, dto);
    this.redis.publish('chat-events', JSON.stringify({
      ev: 'membersUpdated',
      data: {
        chatId: response.id,
        members: response.members,
      },
      chanels: chat?.members,
      meta: { local: false },
      src: ''
    }));

    return response;
  }

  @Delete(':id')
  delete(@Headers('X-User') admin: string, @Param('id') id: string) {
    return this.store.deleteChat(id, admin)
  }
}
