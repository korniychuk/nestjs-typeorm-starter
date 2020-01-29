import { Type } from '@nestjs/common';

import { User } from './user.entity';

export * from './user.entity';

export const entities: Type<any>[] = [
  User,
];
