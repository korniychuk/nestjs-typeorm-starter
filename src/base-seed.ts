import {
  Connection,
  EntitySchema,
  getConnection,
  MigrationInterface,
  ObjectType,
  QueryRunner,
  Repository,
} from 'typeorm';
import * as C from '@configs/constants';

export abstract class BaseSeed implements MigrationInterface {
  public abstract name: string;

  public abstract async up(queryRunner: QueryRunner): Promise<any>;

  public abstract async down(queryRunner: QueryRunner): Promise<any>;

  protected getConnection(): Connection {
    return getConnection(C.TYPEORM_SEEDING_CONNECTION_NAME);
  }

  protected getRepository<TEntity>(target: ObjectType<TEntity> | EntitySchema<TEntity> | string): Repository<TEntity> {
    return this.getConnection().getRepository(target);
  }

}
