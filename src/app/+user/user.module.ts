import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { services } from './services';
import { controllers } from './controllers';
import { entities } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],
  controllers,
  providers: [...services],
})
export class UserModule {
}
