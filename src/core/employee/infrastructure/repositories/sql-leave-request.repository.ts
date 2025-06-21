import { Injectable, Logger } from '@nestjs/common';
import {
  PaginateInput,
  PaginateOutput,
  TypeormRepository,
} from 'src/shared/ddd';
import { DataSource } from 'typeorm';

import { LeaveRequestRepository } from '../../application/repositories/leave-request.repository';
import { LeaveRequestWithEmployeeProjection } from '../../application/repositories/projections/leave-request-with-employee.projection';
import { LeaveRequest } from '../../domain/entities/leave-request.entity';
import { LeaveRequestStatus } from '../../domain/enums/leave-request-status.enum';
import { LeaveRequestMapper } from './models/leave-request.mapper';
import { LeaveRequestModel } from './models/leave-request.model';

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

  async findByStatus(
    pagination: PaginateInput,
    status: LeaveRequestStatus,
  ): Promise<PaginateOutput<LeaveRequestWithEmployeeProjection>> {
    try {
      const repository = this.manager.getRepository(LeaveRequestModel);
      const { take, skip } = pagination;

      const [items, total] = await repository.findAndCount({
        where: { status },
        take,
        skip,
        relations: ['employee'],
      });

      return {
        totalPage: Math.ceil(total / take),
        currentPage: Math.floor(skip / take) + 1,
        take,
        skip,
        items: items.map((item) => ({
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,
          reason: item.reason,
          status: item.status,
          reviewerId: item.reviewerId ?? undefined,
          reviewedAt: item.reviewedAt ?? undefined,
          createdAt: item.createdAt,
          employee: {
            id: item.employee.id,
            name: item.employee.name,
          },
        })),
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
