import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmployeeModel } from './employee.model';
import { LeaveRequestStatus } from '../../../domain/enums/leave-request-status.enum';

@Entity('leave_request')
export class LeaveRequestModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => EmployeeModel, (employee) => employee.leaveRequests)
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeModel;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: LeaveRequestStatus,
    default: LeaveRequestStatus.PENDING,
  })
  status: LeaveRequestStatus;

  @Column({ nullable: true })
  reviewerId: string | null;

  @ManyToOne(() => EmployeeModel)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: EmployeeModel;

  @Column({ nullable: true, type: 'timestamp' })
  reviewedAt: Date | null;

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
      LeaveRequestModel,
      | 'updatedAt'
      | 'updateDateCreation'
      | 'updateDateUpdate'
      | 'employee'
      | 'reviewer'
    >,
  ) {
    Object.assign(this, copy);
  }
}
