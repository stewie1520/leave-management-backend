import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LeaveBalance } from '../../../domain/entities/leave-balance.entity';
import { EmployeeNotFoundError } from '../../../domain/errors';
import { EmployeeRepository } from '../../repositories/employee.repository';

export class GetLeaveBalanceQuery implements IQuery {
  constructor(public readonly accountId: string) {}
}

@QueryHandler(GetLeaveBalanceQuery)
export class GetLeaveBalanceQueryHandler
  implements IQueryHandler<GetLeaveBalanceQuery, LeaveBalance>
{
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: GetLeaveBalanceQuery): Promise<LeaveBalance> {
    const employee = await this.employeeRepository.findByAccountId(
      query.accountId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    return employee.leaveBalance;
  }
}
