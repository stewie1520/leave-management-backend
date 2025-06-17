import { Employee } from '../../../domain/entities/employee.entity';
import { EmployeeModel } from './employee.model';
import { LeaveBalanceMapper } from './leave-balance.mapper';

export class EmployeeMapper {
  private readonly leaveBalanceMapper = new LeaveBalanceMapper();

  toDomain(model: EmployeeModel): Employee {
    return Employee.create({
      id: model.id,
      name: model.name,
      role: model.role,
      accountId: model.accountId,
      leaveBalance: this.leaveBalanceMapper
        .toDomain(model.leaveBalance)
        .getProps(),
    });
  }

  toModel(entity: Employee): EmployeeModel {
    return new EmployeeModel({
      id: entity.id,
      name: entity.name,
      role: entity.role,
      accountId: entity.accountId,
      leaveBalance: this.leaveBalanceMapper.toModel(entity.leaveBalance),
    });
  }
}
