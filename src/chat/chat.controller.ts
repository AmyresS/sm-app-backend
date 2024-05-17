import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Auth()
  async createChat(
    @Body() dto: CreateChatDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.chatService.createChat(dto, userId);
  }
}
