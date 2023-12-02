import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

import { Server } from 'ws';
import { Observable, from, map, of } from 'rxjs';

import { ChatService } from './chat.service';
import { BroadcastMessageDto } from './dto/broadcast.message.dto';

@WebSocketGateway(40021)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit(server: any): void {
    this.logger.log('Init');
  }

  handleDisconnect(client: any): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: any, ...args: any[]): void {
    this.logger.log(`Client connected: `,);
  }

  @SubscribeMessage('send-message')
  create(client: any, data: BroadcastMessageDto): Observable<WsResponse<BroadcastMessageDto>> {
    return of({ event: 'received-message', data });
  }
}
