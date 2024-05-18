import { Body, Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserDto } from './dto/user.dto';
import { FetchUsersDto } from './dto/fetch-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async fetchUsers(@Body() dto: FetchUsersDto): Promise<UserDto[]> {
    return this.userService.fetchUsers(dto);
  }

  @Get(':id')
  @Auth()
  async findById(@Param('id') id: string): Promise<UserDto> {
    return new UserDto(await this.userService.getById(id));
  }
}
