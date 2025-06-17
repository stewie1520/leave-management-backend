import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginateInput, PaginateOutput } from 'src/shared/ddd';

import { LeaveRequest } from '../../../domain/entities/leave-request.entity';
import { EmployeeRepository, LeaveRequestRepository } from '../../repositories';
import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';
import { EmployeeNotFoundError } from '../../../domain/errors';

export class ListLeaveRequestsQuery implements IQuery {
  constructor(
    public readonly accountId: string,
    public readonly pagination: PaginateInput,
    public readonly status?: LeaveRequestStatus,
  ) {}
}

@QueryHandler(ListLeaveRequestsQuery)
export class ListLeaveRequestsQueryHandler
  implements IQueryHandler<ListLeaveRequestsQuery, PaginateOutput<LeaveRequest>>
{
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async execute(
    query: ListLeaveRequestsQuery,
  ): Promise<PaginateOutput<LeaveRequest>> {
    const employee = await this.employeeRepository.findByAccountId(
      query.accountId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    const leaveRequests = await this.leaveRequestRepository.findByEmployeeId(
      employee.id,
      query.pagination,
      query.status,
    );

    return leaveRequests;
  }
}
