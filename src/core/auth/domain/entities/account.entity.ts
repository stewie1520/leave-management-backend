import { AggregateRoot, EntityProps } from 'src/shared/ddd';

import { PASSWORD_VALIDATION } from '../constants/password';
import { InvalidPasswordError } from '../errors/invalid-password.error';

interface AccountProps extends EntityProps {
  email: string;
  password: string;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps) {
    super(props);
  }

  public get email(): string {
    return this.props.email;
  }

  public get password(): string {
    return this.props.password;
  }

  public validatePassword() {
    if (!PASSWORD_VALIDATION.test(this.password)) {
      throw new InvalidPasswordError();
    }
  }

  public static create(props: AccountProps): Account {
    const account = new Account(props);
    account.validatePassword();

    return account;
  }
}
