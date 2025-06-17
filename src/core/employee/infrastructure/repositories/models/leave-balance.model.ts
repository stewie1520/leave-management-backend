import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmployeeModel } from './employee.model';

@Entity('leave_balance')
export class LeaveBalanceModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => EmployeeModel, (employee) => employee.leaveBalance)
  @JoinColumn()
  employee: EmployeeModel;

  @Column()
  totalDays: number;

  @Column({ default: 0 })
  usedDays: number;

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
      LeaveBalanceModel,
      | 'createdAt'
      | 'updatedAt'
      | 'updateDateCreation'
      | 'updateDateUpdate'
      | 'employee'
    >,
  ) {
    Object.assign(this, copy);
  }
}
