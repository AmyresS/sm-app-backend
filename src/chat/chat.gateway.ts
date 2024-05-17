import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  afterInit(server: Server) {
    console.log('websocket init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake.headers.authorization);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('test')
  handleMessage(client: Socket, payload: string) {
    console.log(payload);
  }
}
