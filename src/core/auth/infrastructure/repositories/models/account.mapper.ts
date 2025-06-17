import { Account } from 'src/core/auth/domain/entities/account.entity';
import { AccountModel } from './account.model';

export class AccountMapper {
  toModel(account: Account): AccountModel {
    return new AccountModel({
      id: account.id,
      email: account.email,
      password: account.password,
    });
  }

  toDomain(account: AccountModel): Account {
    return Account.create({
      id: account.id,
      email: account.email,
      password: account.password,
    });
  }
}
