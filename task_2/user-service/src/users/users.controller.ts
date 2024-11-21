import { Controller, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('reset-problems')
  async resetProblems() {
    return this.usersService.resetProblems();
  }
}
