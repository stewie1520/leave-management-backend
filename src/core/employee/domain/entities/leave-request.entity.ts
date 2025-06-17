import dayjs from 'dayjs';
import { AggregateRoot, EntityProps } from 'src/shared/ddd';

import { LeaveRequestStatus } from '../enums/leave-request-status.enum';
import { UnauthorizedLeaveRequestActionError } from '../errors/unauthorized-leave-request-action.error';
import { Employee } from './employee.entity';

export interface LeaveRequestProps extends EntityProps {
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveRequestStatus;
  reviewerId?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export class LeaveRequest extends AggregateRoot<LeaveRequestProps> {
  private constructor(props: LeaveRequestProps) {
    super(props);
  }

  public get employeeId(): string {
    return this.props.employeeId;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date {
    return this.props.endDate;
  }

  public get reason(): string {
    return this.props.reason;
  }

  public get status(): LeaveRequestStatus {
    return this.props.status;
  }

  public get reviewerId(): string | undefined {
    return this.props.reviewerId;
  }

  public get reviewedAt(): Date | undefined {
    return this.props.reviewedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public getDurationInDays(): number {
    return dayjs(this.endDate).diff(this.startDate, 'days') + 1;
  }

  public isPending(): boolean {
    return this.status === LeaveRequestStatus.PENDING;
  }

  public isApproved(): boolean {
    return this.status === LeaveRequestStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this.status === LeaveRequestStatus.REJECTED;
  }

  public approve(reviewer: Employee): void {
    if (!reviewer.isManager()) {
      throw new UnauthorizedLeaveRequestActionError();
    }

    if (!this.isPending()) {
      throw new Error('Can only approve pending leave requests');
    }

    this.props.status = LeaveRequestStatus.APPROVED;
    this.props.reviewerId = reviewer.id;
    this.props.reviewedAt = new Date();
  }

  public reject(reviewer: Employee): void {
    if (!reviewer.isManager()) {
      throw new UnauthorizedLeaveRequestActionError();
    }

    if (!this.isPending()) {
      throw new Error('Can only reject pending leave requests');
    }

    this.props.status = LeaveRequestStatus.REJECTED;
    this.props.reviewerId = reviewer.id;
    this.props.reviewedAt = new Date();
  }

  public static create(props: LeaveRequestProps): LeaveRequest {
    const leaveRequest = new LeaveRequest({
      ...props,
      status: LeaveRequestStatus.PENDING,
    });

    if (props.startDate > props.endDate) {
      throw new Error('Start date must be before or equal to end date');
    }

    return leaveRequest;
  }
}
