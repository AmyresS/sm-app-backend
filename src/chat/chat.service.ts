import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';

interface ChatRecipient {
  userId: string;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findMyChats(userId: string): Promise<ChatDto[]> {
    const chats = await this.prisma.chatRecipient.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            recipients: true,
          },
        },
      },
    });

    return chats.map<ChatDto>((chat) => new ChatDto(chat.chat));
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
}
