import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from '@hapi/joi';

import { getDefaultConnection } from '@configs/ormconfig';

import { entities as userEntities } from './+user/entities';
import { UserModule } from './+user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_
      }),
    }),
    TypeOrmModule.forRoot({
      ...getDefaultConnection(),
      entities: [...userEntities],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  public constructor(
    private readonly $config: ConfigService,
  ) {
    $config.get()
  }

}
