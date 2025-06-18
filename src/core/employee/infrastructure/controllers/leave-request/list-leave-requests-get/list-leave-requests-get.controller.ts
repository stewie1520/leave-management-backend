import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginateOutput } from 'src/shared/ddd';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { ListLeaveRequestsQuery } from '../../../../application/queries/list-leave-requests/list-leave-requests.command';
import { LeaveRequest } from '../../../../domain/entities/leave-request.entity';
import { EmployeeRole } from '../../../../domain/enums/employee-role.enum';
import { LeaveRequestStatus } from '../../../../domain/enums/leave-request-status.enum';
import { EmployeeNotFoundError } from '../../../../domain/errors';

class LeaveRequestInDto {
  @IsNumber()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  take: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip: number;

  @IsOptional()
  status?: LeaveRequestStatus;
}

class LeaveRequestDto {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveRequestStatus;
  reviewerId?: string;
  reviewedAt?: Date;
  createdAt: Date;

  constructor(leaveRequest: LeaveRequest) {
    this.id = leaveRequest.id;
    this.startDate = leaveRequest.startDate;
    this.endDate = leaveRequest.endDate;
    this.reason = leaveRequest.reason;
    this.status = leaveRequest.status;
    this.reviewerId = leaveRequest.reviewerId;
    this.reviewedAt = leaveRequest.reviewedAt;
    this.createdAt = leaveRequest.createdAt;
  }
}

class LeaveRequestOutDto {
  totalPage: number;
  currentPage: number;
  take: number;
  skip: number;
  items: LeaveRequestDto[];

  constructor(
    totalPage: number,
    currentPage: number,
    take: number,
    skip: number,
    items: LeaveRequestDto[],
  ) {
    this.totalPage = totalPage;
    this.currentPage = currentPage;
    this.take = take;
    this.skip = skip;
    this.items = items;
  }
}

@Controller('leave-request')
@ApiTags('leave-request')
@Roles(EmployeeRole.MANAGER, EmployeeRole.STAFF)
@UseGuards(RolesGuard)
export class ListLeaveRequestsGetController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @Get('/')
  async listLeaveRequests(
    @AccountParam() accountId: string,
    @Query() query: LeaveRequestInDto,
  ): Promise<LeaveRequestOutDto> {
    try {
      const leaveRequests = await this.queryBus.execute<
        ListLeaveRequestsQuery,
        PaginateOutput<LeaveRequest>
      >(
        new ListLeaveRequestsQuery(
          accountId,
          {
            skip: query.skip,
            take: query.take,
          },
          query.status,
        ),
      );

      return new LeaveRequestOutDto(
        leaveRequests.totalPage,
        leaveRequests.currentPage,
        leaveRequests.take,
        leaveRequests.skip,
        leaveRequests.items.map((item) => new LeaveRequestDto(item)),
      );
    } catch (error) {
      this.logger.error('Error listing leave requests', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to list leave requests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
