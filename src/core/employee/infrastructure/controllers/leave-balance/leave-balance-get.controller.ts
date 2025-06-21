import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';
import { GetLeaveBalanceQuery } from '../../../application/queries/get-leave-balance/get-leave-balance.query';
import { LeaveBalance } from '../../../domain/entities/leave-balance.entity';
import { EmployeeNotFoundError } from '../../../domain/errors';

class LeaveBalanceOutDto {
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
@ApiBearerAuth()
export class LeaveBalanceGetController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    type: LeaveBalanceOutDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee not found',
  })
  async getLeaveBalance(
    @AccountParam() accountId: string,
  ): Promise<LeaveBalanceOutDto> {
    try {
      const leaveBalance = await this.queryBus.execute<
        GetLeaveBalanceQuery,
        LeaveBalance
      >(new GetLeaveBalanceQuery(accountId));

      return new LeaveBalanceOutDto(leaveBalance);
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
