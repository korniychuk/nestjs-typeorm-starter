import { Provider } from '@nestjs/common';

import { UserDbService } from './user-db.service';

export const services: Provider[] = [
  UserDbService,
];
