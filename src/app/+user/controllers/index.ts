import { Type } from '@nestjs/common';
import { UserController } from './user.controller';

export const controllers: Type<any>[] = [
  UserController,
];
