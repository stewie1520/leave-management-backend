import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { randomUUID } from 'crypto';
import { TestModule } from 'src/shared/test';
import { EmployeeRepository } from '../../application/repositories';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeRole } from '../../domain/enums/employee-role.enum';
import { EmployeeModule } from '../../employee.module';
import { EmployeeMapper } from './models/employee.mapper';
import { EmployeeModel } from './models/employee.model';
import { SqlEmployeeRepository } from './sql-employee.repository';

describe(SqlEmployeeRepository.name, () => {
  let employeeRepository: SqlEmployeeRepository;
  let app: INestApplication;
  let dataSource: DataSource;
  const employeeMapper = new EmployeeMapper();

  beforeAll(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [TestModule, EmployeeModule],
    });

    const testingModule = await testingModuleBuilder.compile();

    app = testingModule.createNestApplication();
    await app.init();

    employeeRepository = app.get(EmployeeRepository);
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM employee');
  });

  describe('findByAccountId', () => {
    it('should return an employee if exists', async () => {
      const employee = Employee.create({
        name: 'John Doe',
        accountId: randomUUID(),
        role: EmployeeRole.STAFF,
        leaveBalance: {
          usedDays: 16,
          totalDays: 20,
        },
      });

      await dataSource
        .getRepository(EmployeeModel)
        .save(employeeMapper.toModel(employee));

      const dbEmployee = await employeeRepository.findByAccountId(
        employee.accountId,
      );

      expect(dbEmployee).not.toBeNull();
      expect(dbEmployee?.id).toEqual(employee.id);
      expect(dbEmployee?.name).toEqual(employee.name);
      expect(dbEmployee?.accountId).toEqual(employee.accountId);
    });

    it('should return null if employee does not exist', async () => {
      const accountId = randomUUID();

      const dbEmployee = await employeeRepository.findByAccountId(accountId);

      expect(dbEmployee).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return an employee if exists', async () => {
      const employee = Employee.create({
        name: 'John Doe',
        accountId: randomUUID(),
        role: EmployeeRole.STAFF,
        leaveBalance: {
          usedDays: 16,
          totalDays: 20,
        },
      });

      await dataSource
        .getRepository(EmployeeModel)
        .save(employeeMapper.toModel(employee));

      const dbEmployee = await employeeRepository.findOne(employee.id);

      expect(dbEmployee).not.toBeNull();
      expect(dbEmployee?.id).toEqual(employee.id);
      expect(dbEmployee?.name).toEqual(employee.name);
      expect(dbEmployee?.accountId).toEqual(employee.accountId);
      expect(dbEmployee?.leaveBalance).toBeTruthy();
    });

    it('should return null if employee does not exist', async () => {
      const id = randomUUID();

      const dbEmployee = await employeeRepository.findOne(id);

      expect(dbEmployee).toBeNull();
    });
  });
});
