import { SetMetadata } from '@nestjs/common';
import { EmployeeRole } from 'src/core/employee/domain/enums/employee-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EmployeeRole[]) =>
  SetMetadata(ROLES_KEY, roles);
