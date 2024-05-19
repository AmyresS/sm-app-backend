import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ChatController],
  providers: [PrismaService, ChatService, UserService, ConfigService],
})
export class ChatModule {}
