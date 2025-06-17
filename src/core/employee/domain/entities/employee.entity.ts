import { AggregateRoot, EntityProps } from 'src/shared/ddd';

import { EmployeeRole } from '../enums/employee-role.enum';
import { LeaveBalance, LeaveBalanceProps } from './leave-balance.entity';

interface EmployeeProps extends EntityProps {
  name: string;
  role: EmployeeRole;
  accountId: string;
  leaveBalance: LeaveBalanceProps;
}

export class Employee extends AggregateRoot<EmployeeProps> {
  private readonly leaveBalanceEntity: LeaveBalance;

  private constructor(props: EmployeeProps) {
    super(props);

    this.leaveBalanceEntity = LeaveBalance.create(props.leaveBalance);
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): EmployeeRole {
    return this.props.role;
  }

  public get accountId(): string {
    return this.props.accountId;
  }

  public get leaveBalance(): LeaveBalance {
    return this.leaveBalanceEntity;
  }

  public isManager(): boolean {
    return this.role === EmployeeRole.MANAGER;
  }

  public returnLeave(durationInDays: number): void {
    this.leaveBalanceEntity.returnLeave(durationInDays);
  }

  public useLeave(durationInDays: number): void {
    this.leaveBalanceEntity.useLeave(durationInDays);
  }

  public static create(props: EmployeeProps): Employee {
    return new Employee(props);
  }
}
