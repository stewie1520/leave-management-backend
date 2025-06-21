import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Employee } from '../../../domain/entities/employee.entity';
import { EmployeeNotFoundError } from '../../../domain/errors';
import { EmployeeRepository } from '../../repositories';

export class EmployeeQuery implements IQuery {
  constructor(public readonly accountId: string) {}
}

@QueryHandler(EmployeeQuery)
export class EmployeeQueryHandler
  implements IQueryHandler<EmployeeQuery, Employee>
{
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: EmployeeQuery): Promise<Employee> {
    const employee = await this.employeeRepository.findByAccountId(
      query.accountId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    return employee;
  }
}
