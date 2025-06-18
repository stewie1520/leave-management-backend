import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmployeeRole } from '../../../domain/enums/employee-role.enum';
import { LeaveBalanceModel } from './leave-balance.model';
import { LeaveRequestModel } from './leave-request.model';

@Entity('employee')
export class EmployeeModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.STAFF,
  })
  role: EmployeeRole;

  @Column()
  accountId: string;

  @OneToMany(() => LeaveRequestModel, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequestModel[];

  @OneToOne(() => LeaveBalanceModel, (leaveBalance) => leaveBalance.employee, {
    cascade: true,
  })
  @JoinColumn()
  leaveBalance: LeaveBalanceModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt ??= new Date();
    this.updatedAt ??= new Date();
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = new Date();
  }

  constructor(
    copy: Omit<
      EmployeeModel,
      | 'createdAt'
      | 'updatedAt'
      | 'updateDateCreation'
      | 'updateDateUpdate'
      | 'leaveRequests'
    >,
  ) {
    Object.assign(this, copy);
  }
}
