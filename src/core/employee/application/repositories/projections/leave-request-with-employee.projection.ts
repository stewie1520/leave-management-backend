import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';

export interface LeaveRequestWithEmployeeProjection {
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
