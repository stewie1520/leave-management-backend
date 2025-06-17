import { Entity, EntityProps } from 'src/shared/ddd';
import { InsufficientLeaveBalanceError } from '../errors';

export interface LeaveBalanceProps extends EntityProps {
  totalDays: number;
  usedDays: number;
}

export class LeaveBalance extends Entity<LeaveBalanceProps> {
  private constructor(props: LeaveBalanceProps) {
    super(props);
  }

  public get totalDays(): number {
    return this.props.totalDays;
  }

  public get usedDays(): number {
    return this.props.usedDays;
  }

  public get availableDays(): number {
    return this.totalDays - this.usedDays;
  }

  public hasEnoughBalance(requestedDays: number): boolean {
    return this.availableDays >= requestedDays;
  }

  public useLeave(days: number): void {
    if (!this.hasEnoughBalance(days)) {
      throw new InsufficientLeaveBalanceError();
    }
    this.props.usedDays += days;
  }

  public returnLeave(days: number): void {
    this.props.usedDays = Math.max(0, this.props.usedDays - days);
  }

  public static create(props: LeaveBalanceProps): LeaveBalance {
    if (props.totalDays < 0) {
      throw new Error('Total days cannot be negative');
    }

    if (props.usedDays < 0) {
      throw new Error('Used days cannot be negative');
    }

    if (props.usedDays > props.totalDays) {
      throw new Error('Used days cannot exceed total days');
    }

    return new LeaveBalance(props);
  }
}
