import { MessageDto } from './message.dto';

export class ChatDto {
  public id: string;
  public title: string;
  public avatar: string;
  public description: string;
  public private: boolean;

  public recipients: string[];
  public lastMessage: MessageDto | null;

  constructor(chat: any) {
    this.id = chat.id;
    this.title = chat.title;
    this.avatar = chat.avatar;
    this.description = chat.description;
    this.private = chat.private;

    this.recipients = chat.recipients.map((r) => r.userId);
  }

  public withLastMessage(lastMessage: MessageDto): ChatDto {
    this.lastMessage = lastMessage;
    return this;
  }
}
