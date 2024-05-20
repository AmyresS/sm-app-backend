import { UseGuards } from '@nestjs/common';
import { WebSocketAuthGuard } from '../guards/websocket-auth.guard';

export const WebSocketAuth = () => UseGuards(WebSocketAuthGuard);
