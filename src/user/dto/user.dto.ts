export class UserDto {
  public id: string;
  public email: string;
  public name: string;
  public avatar: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
