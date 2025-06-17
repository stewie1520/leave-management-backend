import { LeaveBalance } from '../../../domain/entities/leave-balance.entity';
import { LeaveBalanceModel } from './leave-balance.model';

export class LeaveBalanceMapper {
  toDomain(model: LeaveBalanceModel): LeaveBalance {
    return LeaveBalance.create({
      id: model.id,
      totalDays: model.totalDays,
      usedDays: model.usedDays,
    });
  }

  toModel(entity: LeaveBalance): LeaveBalanceModel {
    return new LeaveBalanceModel({
      id: entity.id,
      totalDays: entity.totalDays,
      usedDays: entity.usedDays,
    });
  }
}
