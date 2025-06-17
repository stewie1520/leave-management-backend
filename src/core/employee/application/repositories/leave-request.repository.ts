import { PaginateInput, PaginateOutput, Repository } from 'src/shared/ddd';

import { LeaveRequest } from '../../domain/entities/leave-request.entity';
import { LeaveRequestStatus } from '../../domain/enums/leave-request-status.enum';

export abstract class LeaveRequestRepository extends Repository<LeaveRequest> {
  abstract findByEmployeeId(
    employeeId: string,
    pagination: PaginateInput,
    status?: LeaveRequestStatus,
  ): Promise<PaginateOutput<LeaveRequest>>;
}
