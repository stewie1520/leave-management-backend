import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';
import {
  EmployeeNotFoundError,
  LeaveRequestNotFoundError,
} from '../../../domain/errors';
import { EmployeeRepository, LeaveRequestRepository } from '../../repositories';

export class ReviewLeaveRequestCommand implements ICommand {
  constructor(
    public readonly leaveRequestId: string,
    public readonly reviewerAccountId: string,
    public readonly status:
      | LeaveRequestStatus.APPROVED
      | LeaveRequestStatus.REJECTED,
  ) {}
}

@CommandHandler(ReviewLeaveRequestCommand)
export class ReviewLeaveRequestCommandHandler
  implements ICommandHandler<ReviewLeaveRequestCommand>
{
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async execute(command: ReviewLeaveRequestCommand): Promise<void> {
    const [reviewer, leaveRequest] = await Promise.all([
      this.employeeRepository.findByAccountId(command.reviewerAccountId),
      this.leaveRequestRepository.findOne(command.leaveRequestId),
    ]);

    if (!reviewer) {
      throw new EmployeeNotFoundError();
    }

    if (!leaveRequest) {
      throw new LeaveRequestNotFoundError();
    }

    const employee = await this.employeeRepository.findByAccountId(
      leaveRequest.employeeId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    if (command.status === LeaveRequestStatus.APPROVED) {
      leaveRequest.approve(reviewer);
    } else {
      leaveRequest.reject(reviewer);
      employee.returnLeave(leaveRequest.getDurationInDays());
      await this.employeeRepository.save(employee);
    }

    await this.leaveRequestRepository.save(leaveRequest);
  }
}
