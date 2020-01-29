import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../entities';

/**
 * This is a demo db service. Feel free to remove/update it.
 */
@Injectable()
export class UserDbService {

  public constructor(
    @InjectRepository(User)
    private readonly $userRepo: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.$userRepo.find();
  }

}
