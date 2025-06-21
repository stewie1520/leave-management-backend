import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { TokenService } from '../../services/token.service';

export class LogOutCommand implements ICommand {
  constructor(public readonly tokenId: string) {}
}

@CommandHandler(LogOutCommand)
export class LogOutCommandHandler implements ICommandHandler<LogOutCommand> {
  constructor(private readonly tokenService: TokenService) {}

  async execute(command: LogOutCommand): Promise<void> {
    await this.tokenService.revoke(command.tokenId);
  }
}
