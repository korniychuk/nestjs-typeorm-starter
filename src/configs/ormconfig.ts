import { ConnectionOptions } from 'typeorm';

import { typeORMNamingStrategy } from './typeorm-postgres-naming-strategy.instance';
import * as C from './constants';
import * as helpers from './helpers';

export const defaultConnection: ConnectionOptions = {
  // TODO: extract connection options from the ENV variables/.env file
  host: 'localhost',
  port: 5432,
  username: 'the_bot',
  password: '111',
  database: 'the_bot_db',

  name: 'default',
  type: 'postgres',
  namingStrategy: typeORMNamingStrategy,
  synchronize: false,
  logging: true, // TODO: make it ENV depend
};

export const typeOrmConfig: ConnectionOptions[] = [
  {
    ...defaultConnection,
    entities: [helpers.rootDir('src/**/*.entity.ts')],
    migrations: [helpers.rootDir(`${ C.TYPEORM_MIGRATIONS_DIR }/*.ts`)],
    migrationsTableName: 'Migrations',
    cli: {
      migrationsDir: C.TYPEORM_MIGRATIONS_DIR,
    },
  },
  {
    ...defaultConnection,
    name: C.TYPEORM_SEEDING_CONNECTION_NAME,
    entities: [helpers.rootDir('src/**/*.entity.ts')],
    migrations: [helpers.rootDir(`${ C.TYPEORM_SEEDS_DIR }/*.ts`)],
    migrationsTableName: 'Seeds',
    cli: {
      migrationsDir: C.TYPEORM_SEEDS_DIR,
    },
  },
];
