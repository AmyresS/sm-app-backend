import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FetchUsersDto } from './dto/fetch-users.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async fetchUsers(dto: FetchUsersDto): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: dto.users } },
    });

    return users.map((user) => new UserDto(user));
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password),
    };

    const newUser = await this.prisma.user.create({
      data: user,
    });

    return newUser;
  }
}
