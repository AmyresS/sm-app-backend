import {
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';
import { WebSocketAuth } from './decorators/websocket-auth.decorator';
import { WebSocketUser } from './decorators/websocket-user.decorator';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() io: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): any {
    this.logger.log('websocket init');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: Socket) {}

  @SubscribeMessage('test')
  @WebSocketAuth()
  handleMessage(
    @ConnectedSocket() client: Socket,
    @WebSocketUser('id') userId: string,
    @MessageBody() payload: string,
  ) {
    this.logger.log(userId);
    this.logger.log(payload);
  }
}
