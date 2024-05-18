import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ChatDto } from './dto/chat.dto';
import { MessageDto } from './dto/message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @Auth()
  async findMyChats(@CurrentUser('id') userId: string) {
    return await this.chatService.findMyChats(userId);
  }

  @Get(':id')
  @Auth()
  async findById(@Param('id') id: string): Promise<ChatDto> {
    return await this.chatService.findById(id);
  }

  @Post()
  @Auth()
  async createChat(
    @Body() dto: CreateChatDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.chatService.createChat(dto, userId);
  }

  @Get(':id/message')
  @Auth()
  async getChatMessages(
    @CurrentUser('id') userId: string,
    @Param('id') chatId: string,
  ): Promise<MessageDto[]> {
    return await this.chatService.getChatMessages(userId, chatId);
  }
}
