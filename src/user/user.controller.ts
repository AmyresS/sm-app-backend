import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Auth()
  async findById(@Param('id') id: string): Promise<UserDto> {
    return new UserDto(await this.userService.getById(id));
  }
}
