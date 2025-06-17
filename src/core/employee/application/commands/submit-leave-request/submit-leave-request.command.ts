import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { LeaveRequest } from '../../../domain/entities/leave-request.entity';
import { EmployeeNotFoundError } from '../../../domain/errors';
import { EmployeeRepository, LeaveRequestRepository } from '../../repositories';
import { LeaveRequestStatus } from 'src/core/employee/domain/enums/leave-request-status.enum';

export class SubmitLeaveRequestCommand implements ICommand {
  constructor(
    public readonly accountId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly reason: string,
  ) {}
}

@CommandHandler(SubmitLeaveRequestCommand)
export class SubmitLeaveRequestCommandHandler
  implements ICommandHandler<SubmitLeaveRequestCommand>
{
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async execute(command: SubmitLeaveRequestCommand): Promise<void> {
    const employee = await this.employeeRepository.findByAccountId(
      command.accountId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    const leaveRequest = LeaveRequest.create({
      employeeId: employee.id,
      startDate: command.startDate,
      endDate: command.endDate,
      status: LeaveRequestStatus.PENDING,
      reason: command.reason,
      createdAt: new Date(),
    });

    employee.useLeave(leaveRequest.getDurationInDays());

    await Promise.all([
      this.leaveRequestRepository.save(leaveRequest),
      this.employeeRepository.save(employee),
    ]);
  }
}
