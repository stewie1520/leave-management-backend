import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeormRepository } from 'src/shared/ddd';

import { EmployeeRepository } from '../../application/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeMapper } from './models/employee.mapper';
import { EmployeeModel } from './models/employee.model';

@Injectable()
export class SqlEmployeeRepository
  extends TypeormRepository<Employee, EmployeeModel>
  implements EmployeeRepository
{
  private readonly employeeMapper = new EmployeeMapper();

  aggregateRootToModel = (args) => this.employeeMapper.toModel(args);
  modelToAggregateRoot = (args) => this.employeeMapper.toDomain(args);

  constructor(
    dataSource: DataSource,
    private readonly loggerService: Logger,
  ) {
    super(dataSource, 'employee');
  }

  async findByAccountId(accountId: string): Promise<Employee | null> {
    try {
      const employee = await this.manager
        .getRepository(EmployeeModel)
        .findOne({ where: { accountId }, relations: ['leaveBalance'] });

      return employee ? this.modelToAggregateRoot(employee) : null;
    } catch (error) {
      this.loggerService.warn(error);
      return null;
    }
  }

  override async findOne(id: string): Promise<Employee | null> {
    try {
      const employee = await this.manager
        .getRepository(EmployeeModel)
        .findOne({ where: { id }, relations: ['leaveBalance'] });

      return employee ? this.modelToAggregateRoot(employee) : null;
    } catch (error) {
      this.loggerService.warn(error);
      return null;
    }
  }
}
