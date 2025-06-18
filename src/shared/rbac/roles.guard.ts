import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';
import { TokenPayload } from 'src/core/auth/application/services/token.service';
import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';
import { EmployeeRepository } from 'src/core/employee/application/repositories';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EmployeeRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { token } = context
      .switchToHttp()
      .getRequest<{ token: TokenPayload }>();

    const employee = await this.employeeRepository.findByAccountId(
      token.accountId,
    );

    if (!employee) {
      return false;
    }

    return requiredRoles.includes(employee.role);
  }
}
