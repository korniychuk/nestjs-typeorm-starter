import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getDefaultConnection } from '@configs/ormconfig';

import { entities as userEntities } from './+user/entities';
import { UserModule } from './+user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getDefaultConnection(),
      entities: [...userEntities],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
