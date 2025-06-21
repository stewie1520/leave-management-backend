import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';
import { LeaveRequestWithEmployeeProjection } from '../../repositories/projections/leave-request-with-employee.projection';

export interface PendingLeaveRequestResponse {
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
}

export const fromProjectionToResponse = (
  projection: LeaveRequestWithEmployeeProjection,
): PendingLeaveRequestResponse => ({
  id: projection.id,
  startDate: projection.startDate,
  endDate: projection.endDate,
  reason: projection.reason,
  status: projection.status,
  reviewerId: projection.reviewerId,
  reviewedAt: projection.reviewedAt,
  createdAt: projection.createdAt,
  employee: {
    id: projection.employee.id,
    name: projection.employee.name,
  },
});
