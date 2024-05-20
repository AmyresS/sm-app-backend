/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  private readonly logger = new Logger(WebSocketAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.getArgs()[0];

    const authorization = client.handshake?.headers?.authorization;
    if (!authorization) {
      this.logger.warn('no client authorization');
      client.disconnect();
      return false;
    }

    const match = authorization.match(/Bearer\s(.+)$/);
    if (!match) {
      this.logger.warn('bearer regex doesnt match');
      client.disconnect();
      return false;
    }

    const accessToken = match[1];
    if (!accessToken) {
      this.logger.warn('no access token');
      client.disconnect();
      return false;
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
        return false;
      }

      return new Promise((resolve, reject) => {
        this.userService.getById(userId).then((user) => {
          if (user) {
            // set user
            const request = context.switchToHttp().getRequest();
            request.user = user;

            this.logger.log(`authorized ${userId} user websocket`);
            resolve(true);
          } else {
            this.logger.warn('user not found');
            client.disconnect();
            reject(false);
          }
        });
      });
    } catch (e) {
      client.disconnect();
      return false;
    }

    return true;
  }
}
