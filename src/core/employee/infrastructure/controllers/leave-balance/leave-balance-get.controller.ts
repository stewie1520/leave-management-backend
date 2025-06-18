import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { GetLeaveBalanceQuery } from '../../../application/queries/get-leave-balance/get-leave-balance.query';
import { LeaveBalance } from '../../../domain/entities/leave-balance.entity';
import { EmployeeNotFoundError } from '../../../domain/errors';
import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';

class LeaveBalanceDto {
  totalDays: number;
  usedDays: number;

  constructor(leaveBalance: LeaveBalance) {
    this.totalDays = leaveBalance.totalDays;
    this.usedDays = leaveBalance.usedDays;
  }
}

@Controller('leave-balance')
@ApiTags('leave-balance')
@Roles(EmployeeRole.MANAGER, EmployeeRole.STAFF)
@UseGuards(RolesGuard)
export class LeaveBalanceGetController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @Get('/')
  async getLeaveBalance(
    @AccountParam() accountId: string,
  ): Promise<LeaveBalanceDto> {
    try {
      const leaveBalance = await this.queryBus.execute<
        GetLeaveBalanceQuery,
        LeaveBalance
      >(new GetLeaveBalanceQuery(accountId));

      return new LeaveBalanceDto(leaveBalance);
    } catch (error) {
      this.logger.error('Error getting leave balance', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to get leave balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
