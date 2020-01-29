/* eslint-disable quotes */
import * as R from 'ramda';
import { QueryRunner } from 'typeorm';

export interface ExistingValue {
  tableName: string;
  columnName: string;
  value: string;
}

export interface PgTypeUsage {
  databaseName: string;
  tableName: string;
  columnName: string;
}


export class MigrationUtils {

  public constructor(
    private readonly queryRunner: QueryRunner,
  ) {}

  public async appendEnumItems(dbEnumName: string, enumLabelsToInsert: string[]): Promise<void> {
    // 1. Getting info
    const existingLabels = await this.getPgEnumExistingLabels(dbEnumName);
    const usages: PgTypeUsage[] = await this.getPgEnumUsageTables(dbEnumName);

    // 2. Find maximal sort order and omit existing items
    // language=PostgreSQL
    const existingLabelsSet = new Set(existingLabels);
    const onlyNewLabels = R.reject(enumItemToInsert => existingLabelsSet.has(enumItemToInsert), enumLabelsToInsert);
    if (R.isEmpty(onlyNewLabels)) return;
    const allLabels: string[] = [...existingLabels, ...onlyNewLabels];

    // 3. Replace old enum with new
    await this.replacePgEnum(dbEnumName, allLabels, usages);
  }

  public async deleteEnumItems(dbEnumName: string, enumItemsToDelete: string[]): Promise<void> {
    // 1. Getting info
    const existingLabels = await this.getPgEnumExistingLabels(dbEnumName);
    const usages: PgTypeUsage[] = await this.getPgEnumUsageTables(dbEnumName);

    // 2. Find labels to remove
    const enumItemsToDeleteSet = new Set(enumItemsToDelete);
    const enumLabelsAfterDelete: string[] = R.reject(enumLabel => enumItemsToDeleteSet.has(enumLabel), existingLabels);
    const existingEnumLabelsToDelete: string[] = existingLabels.filter(label => enumItemsToDeleteSet.has(label));
    const hasItemsToDelete = existingLabels.length !== enumLabelsAfterDelete.length;
    if (!hasItemsToDelete) return;

    // 3. Check labels to remove usage
    if (usages.length) {
      const existingEnumLabelsToDeleteStr
              = existingEnumLabelsToDelete.map(v => `'${ v.replace('\'', '\\\'') }'`).join(', ');
      // language=PostgreSQL
      const makeValuesQuery = (v: PgTypeUsage) => `SELECT '${ v.tableName }' AS tableName, '${ v.columnName }' AS columnName, "${ v.columnName }" AS value
                                           FROM "${ v.tableName }"
                                           WHERE ${ v.columnName } IN (${ existingEnumLabelsToDeleteStr })`;
      const queryStr = usages.map(v => `(${ makeValuesQuery(v) })`).join(' UNION ALL ');
      const values: ExistingValue[] = await this.queryRunner.query(queryStr);
      if (values.length) {
        const valuesStr = JSON.stringify(values, null, 2);
        throw new Error(`Can't revert migration. Can't remove enum next enum items due to usage:\n${ valuesStr }`);
      }
    }

    // 4. Replace old enum with new
    await this.replacePgEnum(dbEnumName, enumLabelsAfterDelete, usages);
  }

  private async getPgEnumTypeId(dbEnumName: string): Promise<number> {
    // language=PostgreSQL
    const [{ oid: dbEnumTypeId } = { oid: undefined }]
                                 = await this.queryRunner.query('SELECT oid FROM pg_type WHERE typname = $1', [dbEnumName]);
    if (!dbEnumTypeId) {
      throw new Error(`Can't find the enum in the DB. Enum Name: ${ dbEnumName }`);
    }

    return dbEnumTypeId;
  }

  private getPgEnumUsageTables(dbEnumName: string): Promise<PgTypeUsage[]> {
    // language=PostgreSQL
    return this.queryRunner.query(`
        SELECT cols.table_catalog AS "databaseName",
               cols.table_name    AS "tableName",
               cols.column_name   AS "columnName"
        FROM information_schema.columns AS cols
        WHERE cols.table_catalog = current_database()
          AND cols.data_type = 'USER-DEFINED'
          AND cols.udt_name = $1
      `, [dbEnumName]);
  }

  private async getPgEnumExistingLabels(dbEnumName: string): Promise<string[]> {
    const dbEnumTypeId = await this.getPgEnumTypeId(dbEnumName);

    // language=PostgreSQL
    const existingEnumItems: { label: string }[]
            = await this.queryRunner.query(`SELECT enumlabel AS label
                                            FROM pg_enum
                                            WHERE enumtypid = $1`, [dbEnumTypeId]);
    const existingLabels = existingEnumItems.map(v => v.label);

    return existingLabels;
  }

  private makePgEnumOldName(dbEnumName: string): string {
    return `__${ dbEnumName }_OLD__`;
  }

  private async replacePgEnum(dbEnumName: string, newEnumLabels: string[], usages: PgTypeUsage[]): Promise<void> {
    const dbEnumOldName = this.makePgEnumOldName(dbEnumName);

    // 1. Rename the enum type you want to change
    // language=PostgreSQL
    await this.queryRunner.query(`ALTER TYPE "${ dbEnumName }" RENAME TO "${ dbEnumOldName }"`);

    // 2. Create new type
    const newLabelsStr = newEnumLabels.map(v => `'${ v.replace('\'', '\\\'') }'`).join(', ');
    // language=PostgreSQL
    await this.queryRunner.query(`CREATE TYPE "EExchangeCode" AS ENUM(${ newLabelsStr })`);

    // 3. Alter all columns where the old type used to use the new type
    // language=PostgreSQL
    const queryPromises = usages.map(v =>
      this.queryRunner.query(`
        ALTER TABLE "${ v.tableName }"
          ALTER COLUMN "${ v.columnName }" TYPE "${ dbEnumName }" USING "${ v.columnName }"::TEXT::"${ dbEnumName }"
      `),
    );
    await Promise.all(queryPromises);

    // 4. Remove old type
    // language=PostgreSQL
    await this.queryRunner.query(`DROP TYPE "${ dbEnumOldName }"`);
  }

}
