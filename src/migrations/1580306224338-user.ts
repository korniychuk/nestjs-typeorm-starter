import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This is a demo migration. Feel free to remove/update it.
 */
export class user1580306224338 implements MigrationInterface {
  public name = 'user1580306224338';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // language=PostgreSQL
      `CREATE TABLE "Users"
         (
             "id"   SERIAL            NOT NULL,
             "name" CHARACTER VARYING NOT NULL,
             CONSTRAINT "PK_Users_id_3f1a6bc3" PRIMARY KEY ("id")
         )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // language=PostgreSQL
    await queryRunner.query('DROP TABLE "Users"', undefined);
  }

}
