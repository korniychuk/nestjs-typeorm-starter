import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { typeORMNamingStrategy } from './typeorm-postgres-naming-strategy.instance';
import * as C from './constants';
import * as helpers from './helpers';

dotenv.config();

export const getDefaultConnection = (): ConnectionOptions => ({
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT! || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DB,

  name: 'default',
  type: 'postgres',
  namingStrategy: typeORMNamingStrategy,
  synchronize: false,
  logging: helpers.parseEnvBoolean(process.env.POSTGRES_LOGGING),
});

export const getTypeOrmConfig = (): ConnectionOptions[] => {
  const defaultConnection = getDefaultConnection();

  return [
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
};
