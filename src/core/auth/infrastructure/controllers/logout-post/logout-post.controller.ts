import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { TokenParam } from '../../../../../shared/rbac';
import { LogOutCommand } from '../../../application/commands/logout/logout.command';
import { TokenPayload } from '../../../application/services/token.service';

@Controller('auth')
@ApiTags('auth')
export class LogoutPostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  @Post('/logout')
  async logout(@TokenParam() token: TokenPayload): Promise<void> {
    try {
      await this.commandBus.execute<LogOutCommand, void>(
        new LogOutCommand(token.id),
      );
    } catch (error) {
      this.logger.log('Error logged out', error);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
