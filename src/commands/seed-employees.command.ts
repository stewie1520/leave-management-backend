import { Command, CommandRunner } from 'nest-commander';

import { AccountRepository } from 'src/core/auth/application/repositories/account.repository';
import { PasswordService } from 'src/core/auth/application/services/password.service';
import { Account } from 'src/core/auth/domain/entities/account.entity';
import { EmployeeRepository } from 'src/core/employee/application/repositories';
import { Employee } from 'src/core/employee/domain/entities/employee.entity';
import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';

@Command({ name: 'seed-employees', description: 'Seed employees and accounts' })
export class SeedEmployeesCommand extends CommandRunner {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly accountRepository: AccountRepository,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      const staffAcount = Account.create({
        email: 'donghuuhieu1520+emp@gmail.com',
        password: await this.passwordService.hashPassword('Gearmen@123'),
      });

      await this.accountRepository.save(staffAcount);

      const staffEmployee = Employee.create({
        name: 'Staff Employee',
        accountId: staffAcount.id,
        role: EmployeeRole.STAFF,
        leaveBalance: {
          totalDays: 16,
          usedDays: 0,
        },
      });

      await this.employeeRepository.save(staffEmployee);

      const managerAccount = Account.create({
        email: 'donghuuhieu1520+mgr@gmail.com',
        password: await this.passwordService.hashPassword('Gearmen@123'),
      });

      await this.accountRepository.save(managerAccount);

      const managerEmployee = Employee.create({
        name: 'Manager Employee',
        accountId: managerAccount.id,
        role: EmployeeRole.MANAGER,
        leaveBalance: {
          totalDays: 16,
          usedDays: 0,
        },
      });

      await this.employeeRepository.save(managerEmployee);

      console.log('Employees seeded successfully');
    } catch (error) {
      console.error('Error seeding employees:', error);
    }
  }
}
