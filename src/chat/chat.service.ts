import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';
import { MessageDto } from './dto/message.dto';
import { PostMessageDto } from './dto/post-message.dto';

interface ChatRecipient {
  userId: string;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  private async getLastMessage(chatId: string): Promise<MessageDto> {
    const message = await this.prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });

    return message ? new MessageDto(message) : null;
  }

  async findMyChats(userId: string): Promise<ChatDto[]> {
    const _chats = await this.prisma.chatRecipient.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            recipients: true,
          },
        },
      },
    });

    const chats = _chats.map<ChatDto>((chat) => new ChatDto(chat.chat));
    // resolve last messages
    for (const chat of chats) {
      chat.withLastMessage(await this.getLastMessage(chat.id));
    }
    return chats;
  }

  async findById(id: string): Promise<ChatDto> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        recipients: true,
      },
    });

    return new ChatDto(chat);
  }

  async createChat(dto: CreateChatDto, userId: string) {
    const ids = [...new Set(dto.recipients.concat(userId))];
    const recipients = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });

    if (recipients.length < 1) {
      throw new BadRequestException('no recipients');
    }

    const chat = await this.prisma.chat.create({
      data: {
        title: dto.title,
        description: dto.description,
        private: recipients.length <= 2,
        recipients: {
          createMany: {
            data: recipients.map<ChatRecipient>((recipient) => ({
              userId: recipient.id,
            })),
          },
        },
      },
    });

    return chat;
  }

  private async getChat(userId: string, chatId: string): Promise<any> {
    const chat = await this.prisma.chatRecipient.findFirst({
      where: { AND: [{ userId }, { chatId }] },
    });
    if (!chat) throw new NotFoundException('no chat found where you present');

    return chat;
  }

  async getChatMessages(userId: string, chatId: string): Promise<MessageDto[]> {
    const chat = await this.getChat(userId, chatId);
    const messages = await this.prisma.message.findMany({
      where: { chatId: chat.chatId },
    });

    return messages.map<MessageDto>((message) => new MessageDto(message));
  }

  async postMessage(
    userId: string,
    chatId: string,
    dto: PostMessageDto,
  ): Promise<MessageDto> {
    const chat = await this.getChat(userId, chatId);
    const message = await this.prisma.message.create({
      data: {
        user: {
          connect: { id: userId },
        },
        chat: {
          connect: { id: chat.chatId },
        },
        message: dto.message,
      },
    });

    return new MessageDto(message);
  }
}
