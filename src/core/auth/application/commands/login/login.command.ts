import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Token } from 'src/core/auth/domain/entities/token.entity';

import { AccountRepository } from '../../repositories/account.repository';
import { InvalidCredentialsError } from './invalid-credentials.error';
import { PasswordService } from '../../services/password.service';
import { TokenService } from '../../services/token.service';

export class LoginCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler
  implements ICommandHandler<LoginCommand, Token>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<Token> {
    const account = await this.accountRepository.findByEmail(command.email);
    if (!account) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      command.password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokenService.createToken(account.id);

    return token;
  }
}
