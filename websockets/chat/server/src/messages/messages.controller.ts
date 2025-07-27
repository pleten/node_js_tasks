import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {MessageDTO} from "../dto";
import {Store} from "../store/store";

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private store: Store) {}

  @Get()
  async list(
    @Headers('X-User') user: string,
    @Param('id') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ) {
    const options = {limit: +limit, cursor: cursor ? +cursor : undefined};
    const messages = await this.store.getChatHistory(chatId, options);
    return {
        items: messages,
    }
  }

  @Post()
  create(
    @Headers('X-User') author: string,
    @Param('id') chatId: string,
    @Body('text') text: string,
  ): Promise<MessageDTO> {
    return this.store.sendMessageToChat({chatId, author, text});
  }
}
