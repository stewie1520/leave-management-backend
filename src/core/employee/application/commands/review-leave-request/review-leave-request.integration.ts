import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmployeeModule } from 'src/core/employee/employee.module';
import { TestModule } from 'src/shared/test';
import { DataSource } from 'typeorm';

import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { Employee } from 'src/core/employee/domain/entities/employee.entity';
import { LeaveRequest } from 'src/core/employee/domain/entities/leave-request.entity';
import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';
import { LeaveRequestStatus } from 'src/core/employee/domain/enums/leave-request-status.enum';
import {
  EmployeeNotFoundError,
  LeaveRequestNotFoundError,
  UnauthorizedLeaveRequestActionError,
} from '../../../domain/errors';
import { EmployeeRepository, LeaveRequestRepository } from '../../repositories';
import {
  ReviewLeaveRequestCommand,
  ReviewLeaveRequestCommandHandler,
} from './review-leave-request.command';

describe(ReviewLeaveRequestCommand.name, () => {
  let commandHandler: ReviewLeaveRequestCommandHandler;
  let app: INestApplication;
  let dataSource: DataSource;
  let employeeRepository: EmployeeRepository;
  let leaveRequestRepository: LeaveRequestRepository;

  beforeAll(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [TestModule, EmployeeModule],
    });

    const testingModule = await testingModuleBuilder.compile();

    app = testingModule.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    commandHandler = app.get(ReviewLeaveRequestCommandHandler);
    employeeRepository = app.get(EmployeeRepository);
    leaveRequestRepository = app.get(LeaveRequestRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM leave_request');
    await dataSource.query('DELETE FROM employee');
  });

  describe('given a pending leave request', () => {
    let staffEmployee: Employee;
    let managerEmployee: Employee;
    let leaveRequest: LeaveRequest;

    beforeEach(async () => {
      staffEmployee = Employee.create({
        name: 'John Doe',
        role: EmployeeRole.STAFF,
        accountId: randomUUID(),
        leaveBalance: {
          totalDays: 10,
          usedDays: 5,
        },
      });

      managerEmployee = Employee.create({
        name: 'Jane Doe',
        role: EmployeeRole.MANAGER,
        accountId: randomUUID(),
        leaveBalance: {
          totalDays: 10,
          usedDays: 5,
        },
      });

      leaveRequest = LeaveRequest.create({
        employeeId: staffEmployee.id,
        startDate: new Date(),
        endDate: dayjs().add(2, 'days').toDate(),
        status: LeaveRequestStatus.PENDING,
        reason: 'Vacation',
        createdAt: new Date(),
      });

      await employeeRepository.save(staffEmployee);
      await employeeRepository.save(managerEmployee);
      await leaveRequestRepository.save(leaveRequest);
    });

    it('should be able to approve by a manager', async () => {
      const command = new ReviewLeaveRequestCommand(
        leaveRequest.id,
        managerEmployee.accountId,
        LeaveRequestStatus.APPROVED,
      );

      await commandHandler.execute(command);

      const updatedLeaveRequest = await leaveRequestRepository.findOne(
        leaveRequest.id,
      );

      expect(updatedLeaveRequest?.status).toBe(LeaveRequestStatus.APPROVED);
    });

    it('should throw error if reviewer is not a manager', async () => {
      const command = new ReviewLeaveRequestCommand(
        leaveRequest.id,
        staffEmployee.accountId,
        LeaveRequestStatus.APPROVED,
      );

      await expect(commandHandler.execute(command)).rejects.toThrow(
        UnauthorizedLeaveRequestActionError,
      );
    });

    it('should throw error if leave request is not found', async () => {
      const command = new ReviewLeaveRequestCommand(
        randomUUID(),
        managerEmployee.accountId,
        LeaveRequestStatus.APPROVED,
      );

      await expect(commandHandler.execute(command)).rejects.toThrow(
        LeaveRequestNotFoundError,
      );
    });

    it('should throw error if employee is not found', async () => {
      const command = new ReviewLeaveRequestCommand(
        leaveRequest.id,
        randomUUID(),
        LeaveRequestStatus.APPROVED,
      );

      await expect(commandHandler.execute(command)).rejects.toThrow(
        EmployeeNotFoundError,
      );
    });
  });
});
