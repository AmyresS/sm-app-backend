export class MessageDto {
  public id: string;
  public chatId: string;
  public userId: string;
  public message: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(message: any) {
    this.id = message.id;
    this.chatId = message.chatId;
    this.userId = message.userId;
    this.message = message.message;
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
  }
}
