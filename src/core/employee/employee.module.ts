import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewLeaveRequestCommandHandler } from './application/commands/review-leave-request/review-leave-request.command';
import { SubmitLeaveRequestCommandHandler } from './application/commands/submit-leave-request/submit-leave-request.command';
import { GetLeaveBalanceQueryHandler } from './application/queries/get-leave-balance/get-leave-balance.query';
import { ListLeaveRequestsQueryHandler } from './application/queries/list-leave-requests/list-leave-requests.command';
import { EmployeeRepository } from './application/repositories/employee.repository';
import { LeaveRequestRepository } from './application/repositories/leave-request.repository';
import { LeaveBalanceGetController } from './infrastructure/controllers/leave-balance/leave-balance-get.controller';
import { ListLeaveRequestsGetController } from './infrastructure/controllers/leave-request/list-leave-requests-get/list-leave-requests-get.controller';
import { ReviewLeaveRequestPatchController } from './infrastructure/controllers/leave-request/review-leave-request-patch/review-leave-request-patch.controller';
import { SubmitLeaveRequestPostController } from './infrastructure/controllers/leave-request/submit-leave-request-post/submit-leave-request-post.controller';
import { EmployeeModel } from './infrastructure/repositories/models/employee.model';
import { LeaveBalanceModel } from './infrastructure/repositories/models/leave-balance.model';
import { LeaveRequestModel } from './infrastructure/repositories/models/leave-request.model';
import { SqlEmployeeRepository } from './infrastructure/repositories/sql-employee.repository';
import { SqlLeaveRequestRepository } from './infrastructure/repositories/sql-leave-request.repository';

const commandHandlers = [
  SubmitLeaveRequestCommandHandler,
  ReviewLeaveRequestCommandHandler,
];

const queryHandlers = [
  ListLeaveRequestsQueryHandler,
  GetLeaveBalanceQueryHandler,
];

const repositories = [
  { provide: EmployeeRepository, useClass: SqlEmployeeRepository },
  { provide: LeaveRequestRepository, useClass: SqlLeaveRequestRepository },
];

const controllers = [
  ReviewLeaveRequestPatchController,
  SubmitLeaveRequestPostController,
  ListLeaveRequestsGetController,
  LeaveBalanceGetController,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      EmployeeModel,
      LeaveRequestModel,
      LeaveBalanceModel,
    ]),
  ],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, Logger],
  controllers,
  exports: [EmployeeRepository],
})
export class EmployeeModule {}
