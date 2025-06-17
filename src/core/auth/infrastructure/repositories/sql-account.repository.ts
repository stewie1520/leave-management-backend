import { Injectable, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/core/auth/application/repositories/account.repository';
import { Account } from 'src/core/auth/domain/entities/account.entity';
import { TypeormRepository } from 'src/shared/ddd';
import { DataSource } from 'typeorm';

import { AccountMapper } from './models/account.mapper';
import { AccountModel } from './models/account.model';

@Injectable()
export class SqlAccountRepository
  extends TypeormRepository<Account, AccountModel>
  implements AccountRepository
{
  private readonly accountMapper = new AccountMapper();

  aggregateRootToModel = (args) => this.accountMapper.toModel(args);
  modelToAggregateRoot = (args) => this.accountMapper.toDomain(args);

  constructor(
    dataSource: DataSource,
    private readonly loggerService: Logger,
  ) {
    super(dataSource, 'account');
  }

  async findByEmail(email: string) {
    try {
      const account = await this.manager.getRepository(AccountModel).findOne({
        where: {
          email,
        },
      });

      return account ? this.modelToAggregateRoot(account) : null;
    } catch (error) {
      this.loggerService.warn(error);
      return null;
    }
  }
}
