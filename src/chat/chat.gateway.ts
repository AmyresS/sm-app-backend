import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
  handleConnection(client: Socket, ...args: any[]): any {
    const authorization = client.handshake?.headers?.authorization;
    if (!authorization) {
      this.logger.warn('no client authorization');
      client.disconnect();
      return;
    }

    const match = authorization.match(/Bearer\s(.+)$/);
    if (!match) {
      this.logger.warn('bearer regex doesnt match');
      client.disconnect();
      return;
    }

    const accessToken = match[1];
    if (!accessToken) {
      this.logger.warn('no access token');
      client.disconnect();
      return;
    }

    try {
      const payload = verify(
        accessToken,
        this.configService.get('JWT_SECRET'),
        {
          ignoreExpiration: true,
        },
      );
      const userId = payload['id'];
      if (!userId) {
        this.logger.warn('no user id in jwt payload');
        client.disconnect();
        return;
      }

      const user = this.userService.getById(userId);
      if (!user) {
        this.logger.warn('user not found');
        client.disconnect();
        return;
      }

      this.logger.log(`authorized ${userId} user websocket`);
    } catch (e) {
      client.disconnect();
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: Socket) {}

  @SubscribeMessage('test')
  handleMessage(client: Socket, payload: string) {
    this.logger.log(payload);
  }
}
