import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { SubmitLeaveRequestCommand } from '../../../../application/commands/submit-leave-request/submit-leave-request.command';
import { EmployeeRole } from '../../../../domain/enums/employee-role.enum';
import { EmployeeNotFoundError } from '../../../../domain/errors';
import { InsufficientLeaveBalanceError } from '../../../../domain/errors/insufficient-leave-balance.error';

class SubmitLeaveRequestDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

@Controller('leave-request')
@ApiTags('leave-request')
@Roles(EmployeeRole.MANAGER, EmployeeRole.STAFF)
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class SubmitLeaveRequestPostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  @Post()
  async submitLeaveRequest(
    @AccountParam() accountId: string,
    @Body() body: SubmitLeaveRequestDto,
  ) {
    try {
      await this.commandBus.execute<SubmitLeaveRequestCommand>(
        new SubmitLeaveRequestCommand(
          accountId,
          body.startDate,
          body.endDate,
          body.reason,
        ),
      );
    } catch (error) {
      this.logger.error('Error submitting leave request', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      if (error instanceof InsufficientLeaveBalanceError) {
        throw new HttpException(
          'Insufficient leave balance',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to submit leave request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
