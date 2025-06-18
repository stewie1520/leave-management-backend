import { Repository } from 'src/shared/ddd';

import { Account } from '../../domain/entities/account.entity';

export abstract class AccountRepository extends Repository<Account> {
  abstract findByEmail(email: string): Promise<Account | null>;
}
