import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';
import { EmployeeQuery } from '../../../application/queries/employee/employee.query';
import { Employee } from '../../../domain/entities/employee.entity';
import { EmployeeRole } from '../../../domain/enums/employee-role.enum';
import { EmployeeNotFoundError } from '../../../domain/errors';

class EmployeeOutDto {
  id: string;
  name: string;
  role: EmployeeRole;
  accountId: string;

  constructor(employee: Employee) {
    this.id = employee.id;
    this.name = employee.name;
    this.role = employee.role;
    this.accountId = employee.accountId;
  }
}

@Controller('employee')
@ApiTags('employee')
@Roles(EmployeeRole.MANAGER, EmployeeRole.STAFF)
@UseGuards(RolesGuard)
export class EmployeeGetController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @Get('/')
  async getEmployee(
    @AccountParam() accountId: string,
  ): Promise<EmployeeOutDto> {
    try {
      const employee = await this.queryBus.execute<EmployeeQuery, Employee>(
        new EmployeeQuery(accountId),
      );

      return new EmployeeOutDto(employee);
    } catch (error) {
      this.logger.error('Error getting employee', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to get employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
