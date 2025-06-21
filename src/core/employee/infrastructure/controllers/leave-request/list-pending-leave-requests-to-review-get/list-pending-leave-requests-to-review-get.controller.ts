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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { PaginateOutput } from 'src/shared/ddd';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { ListPendingLeaveRequestsToReviewQuery } from '../../../../application/queries/list-pending-leave-requests-to-review/list-pending-leave-requests-to-review.command';
import { PendingLeaveRequestResponse } from '../../../../application/queries/list-pending-leave-requests-to-review/pending-leave-request.response';
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
  employee: {
    id: string;
    name: string;
  };

  constructor(leaveRequest: PendingLeaveRequestResponse) {
    this.id = leaveRequest.id;
    this.startDate = leaveRequest.startDate;
    this.endDate = leaveRequest.endDate;
    this.reason = leaveRequest.reason;
    this.status = leaveRequest.status;
    this.reviewerId = leaveRequest.reviewerId;
    this.reviewedAt = leaveRequest.reviewedAt;
    this.createdAt = leaveRequest.createdAt;
    this.employee = {
      id: leaveRequest.employee.id,
      name: leaveRequest.employee.name,
    };
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
@Roles(EmployeeRole.MANAGER)
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ListPendingLeaveRequestsToReviewGetController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @Get('/pending-to-review')
  @ApiResponse({
    status: HttpStatus.OK,
    type: LeaveRequestOutDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee not found',
  })
  async listPendingLeaveRequestsToReview(
    @AccountParam() accountId: string,
    @Query() query: LeaveRequestInDto,
  ): Promise<LeaveRequestOutDto> {
    try {
      const pendingLeaveRequests = await this.queryBus.execute<
        ListPendingLeaveRequestsToReviewQuery,
        PaginateOutput<PendingLeaveRequestResponse>
      >(
        new ListPendingLeaveRequestsToReviewQuery(accountId, {
          skip: query.skip,
          take: query.take,
        }),
      );

      return new LeaveRequestOutDto(
        pendingLeaveRequests.totalPage,
        pendingLeaveRequests.currentPage,
        pendingLeaveRequests.take,
        pendingLeaveRequests.skip,
        pendingLeaveRequests.items.map((item) => new LeaveRequestDto(item)),
      );
    } catch (error) {
      this.logger.error('Error listing pending leave requests', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to list pending leave requests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
