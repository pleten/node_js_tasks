import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import Redis from 'ioredis';
import {v4 as uuid} from 'uuid';
import {OnModuleDestroy} from '@nestjs/common';
import {Store} from "../store/store";

const INSTANCE_ID = uuid();   // 🎯 унікальний для кожної репліки
@WebSocketGateway({path: '/ws', cors: true})
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy, OnGatewayInit {

  @WebSocketServer() server: Server = new Server();
  private readonly sub: Redis
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();

  constructor(private store: Store, private readonly redis: Redis) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe('chat-events');
  }
  async afterInit(server: Server) {
    this.server = server;
    await this.sub.on('message', async (_, raw) => {
      console.log('Received event raw:', raw);
      const parsed = JSON.parse(raw);
      if (parsed.src === INSTANCE_ID) return;// ⬅️ skip own
      console.log('Received event:', parsed);
      this.event$.next(parsed);
      if(!parsed.chanels || parsed.chanels.length === 0) {
        this.server.emit(parsed.ev, parsed.data);
      } else {
        this.server.in(parsed.chanels).emit(parsed.ev, parsed.data);
      }
    });

    this.event$
        .pipe(filter((e) => e.meta?.local))
        .subscribe((e) => this.redis.publish('chat-events', JSON.stringify({...e, meta: undefined, src: INSTANCE_ID})));
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;

    if (!user) return client.disconnect(true);
    client.data.user = user;

    client.join(user);
  }

  @SubscribeMessage('join')
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
    client.join(body.chatId);
    this.redis.publish('chat-events', JSON.stringify({ev: 'join', data: {...body, user: client.data.user}, src: INSTANCE_ID, chanels: [body.chatId]}));
  }

  @SubscribeMessage('leave')
  onLeave(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
    client.leave(body.chatId);
    this.redis.publish('chat-events', JSON.stringify({ev: 'leave', data: {...body, user: client.data.user}, src: INSTANCE_ID, chanels: [body.chatId]}));
  }

  @SubscribeMessage('send')
  async onSend(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string; text: string }) {
    const message = await this.store.sendMessageToChat({...body, author: client.data.user})
    this.redis.publish('chat-events', JSON.stringify({ev: 'message', data: message, src: undefined, chanels: [body.chatId]}));
  }

  @SubscribeMessage('typing')
  onTyping(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string; isTyping: boolean }) {
    this.redis.publish('chat-events', JSON.stringify({ev: 'typing', data: {...body, user: client.data.user}, src: undefined, chanels: [body.chatId]}));
  }
}
