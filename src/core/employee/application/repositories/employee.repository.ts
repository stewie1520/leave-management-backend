import { Repository } from 'src/shared/ddd';
import { Employee } from '../../domain/entities/employee.entity';

export abstract class EmployeeRepository extends Repository<Employee> {
  abstract findByAccountId(accountId: string): Promise<Employee | null>;
}
