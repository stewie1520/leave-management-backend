import { LeaveRequest } from '../../../domain/entities/leave-request.entity';
import { LeaveRequestModel } from './leave-request.model';

export class LeaveRequestMapper {
  toDomain(model: LeaveRequestModel): LeaveRequest {
    return LeaveRequest.create({
      id: model.id,
      employeeId: model.employeeId,
      startDate: model.startDate,
      endDate: model.endDate,
      reason: model.reason,
      status: model.status,
      reviewerId: model.reviewerId ?? undefined,
      reviewedAt: model.reviewedAt ?? undefined,
      createdAt: model.createdAt,
    });
  }

  toModel(entity: LeaveRequest): LeaveRequestModel {
    return new LeaveRequestModel({
      id: entity.id,
      employeeId: entity.employeeId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      status: entity.status,
      reviewerId: entity.reviewerId ?? null,
      reviewedAt: entity.reviewedAt ?? null,
      createdAt: entity.createdAt,
    });
  }
}
