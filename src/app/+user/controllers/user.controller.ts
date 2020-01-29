import { Controller, Get } from '@nestjs/common';

import { UserDbService } from '../services/user-db.service';
import { User } from '../entities';

@Controller('users')
export class UserController {


  public constructor(
    private readonly $userDb: UserDbService,
  ) {}

  @Get()
  public getUsers(): Promise<User[]> {
    return this.$userDb.findAll();
  }
}
