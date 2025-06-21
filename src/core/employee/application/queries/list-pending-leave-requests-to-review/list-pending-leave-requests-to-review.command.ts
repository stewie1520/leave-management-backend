import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginateInput, PaginateOutput } from 'src/shared/ddd';

import { EmployeeRole } from '../../../domain/enums/employee-role.enum';
import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';
import {
  EmployeeNotFoundError,
  UnauthorizedLeaveRequestActionError,
} from '../../../domain/errors';
import { EmployeeRepository, LeaveRequestRepository } from '../../repositories';
import {
  fromProjectionToResponse,
  PendingLeaveRequestResponse,
} from './pending-leave-request.response';

/**
 * List leave requests to review by manager
 * The leave requests are in status PENDING
 */
export class ListPendingLeaveRequestsToReviewQuery implements IQuery {
  constructor(
    public readonly accountId: string,
    public readonly pagination: PaginateInput,
  ) {}
}

@QueryHandler(ListPendingLeaveRequestsToReviewQuery)
export class ListPendingLeaveRequestsToReviewQueryHandler
  implements
    IQueryHandler<
      ListPendingLeaveRequestsToReviewQuery,
      PaginateOutput<PendingLeaveRequestResponse>
    >
{
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async execute(
    query: ListPendingLeaveRequestsToReviewQuery,
  ): Promise<PaginateOutput<PendingLeaveRequestResponse>> {
    const employee = await this.employeeRepository.findByAccountId(
      query.accountId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    if (employee.role !== EmployeeRole.MANAGER) {
      throw new UnauthorizedLeaveRequestActionError();
    }

    const pendingLeaveRequests = await this.leaveRequestRepository.findByStatus(
      query.pagination,
      LeaveRequestStatus.PENDING,
    );

    return {
      totalPage: pendingLeaveRequests.totalPage,
      currentPage: pendingLeaveRequests.currentPage,
      take: pendingLeaveRequests.take,
      skip: pendingLeaveRequests.skip,
      items: pendingLeaveRequests.items.map(fromProjectionToResponse),
    };
  }
}
