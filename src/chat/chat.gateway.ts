import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsException } from '@nestjs/websockets';

import { Server } from 'ws';

import { BroadcastMessageDto } from './dto/broadcast.message.dto';

@WebSocketGateway(40021)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private readonly wsClients = [];

  @WebSocketServer()
  server: Server;

  afterInit(server: any): void {
    this.logger.log('Init websocket server');
  }

  handleDisconnect(client: any): void {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcast({ event: 'disconnect' });
    this.logger.log(`Client disconnected`);
  }

  handleConnection(client: any, ...args: any[]): void {
    this.wsClients.push(client);
    this.logger.log(`Client connected: `,);
  }

  @SubscribeMessage('send-message')
  sendMessage(client: any, data: BroadcastMessageDto) {
    try {
      this.broadcast({ event: 'received-message', data })
    } catch (error) {
      throw new WsException(error?.message);
    }
  }

  private broadcast(message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (let c of this.wsClients) {
      c.send(broadCastMessage);
    }
  }
}
