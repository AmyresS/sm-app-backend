import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Auth()
  async findById(@Param('id') id: string) {
    return this.userService.getById(id);
  }
}
