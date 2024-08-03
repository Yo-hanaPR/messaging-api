import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('exclude')
  async getUsersExcluding(@Query('username') username: string) {
    const users = await this.usersService.findUsersExcluding(username);
    return { users };
  }
}
