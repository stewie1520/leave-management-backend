import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  PaginateInput,
  PaginateOutput,
  TypeormRepository,
} from 'src/shared/ddd';

import { LeaveRequestRepository } from '../../application/repositories/leave-request.repository';
import { LeaveRequest } from '../../domain/entities/leave-request.entity';
import { LeaveRequestModel } from './models/leave-request.model';
import { LeaveRequestMapper } from './models/leave-request.mapper';
import { LeaveRequestStatus } from '../../domain/enums/leave-request-status.enum';

@Injectable()
export class SqlLeaveRequestRepository
  extends TypeormRepository<LeaveRequest, LeaveRequestModel>
  implements LeaveRequestRepository
{
  private readonly leaveRequestMapper = new LeaveRequestMapper();

  aggregateRootToModel = (args) => this.leaveRequestMapper.toModel(args);
  modelToAggregateRoot = (args) => this.leaveRequestMapper.toDomain(args);

  constructor(
    dataSource: DataSource,
    private readonly loggerService: Logger,
  ) {
    super(dataSource, 'leave_request');
  }

  async findByEmployeeId(
    employeeId: string,
    pagination: PaginateInput,
    status?: LeaveRequestStatus,
  ): Promise<PaginateOutput<LeaveRequest>> {
    try {
      const repository = this.manager.getRepository(LeaveRequestModel);
      const { take, skip } = pagination;

      const [items, total] = await repository.findAndCount({
        where: { employeeId, status },
        take,
        skip,
      });

      return {
        totalPage: Math.ceil(total / take),
        currentPage: Math.floor(skip / take) + 1,
        take,
        skip,
        items: items.map(this.modelToAggregateRoot),
      };
    } catch (error) {
      this.loggerService.warn(error);

      return {
        totalPage: 0,
        currentPage: 1,
        take: 0,
        skip: 0,
        items: [],
      };
    }
  }
}
