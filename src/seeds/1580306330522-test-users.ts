import { Like } from 'typeorm';
import * as _ from 'lodash';

import { BaseSeed } from '@src/base-seed';
import { User } from '@app/+user/entities';

const fakeUser = (name: string) => _.assign(new User(), { name });

/**
 * This is a demo seed. Feel free to remove/update it.
 */
export class TestUsers1580306330522 extends BaseSeed {
  public name = 'TestUsers1580306330522';

  public async up(): Promise<any> {
    const repo = this.getRepository(User);

    await repo.insert([
      fakeUser('Ivan (TypeORM Test)'),
      fakeUser('Kate (TypeORM Test)'),
    ]);
  }

  public async down(): Promise<any> {
    const repo = this.getRepository(User);

    await repo.delete({ name: Like('%(TypeORM Test)') });
  }

}
