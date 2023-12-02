import { WebSocketGateway,WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';

import { Server } from 'ws';
import { from, map } from 'rxjs';

import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { BroadcastMessageDto } from './dto/broadcast.message.dto';

@WebSocketGateway(8080)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('events')
  create(client: any, data: BroadcastMessageDto) {
    console.log(data, 'suckers');
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
