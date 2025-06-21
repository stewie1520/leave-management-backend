import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { AccountParam, Roles, RolesGuard } from 'src/shared/rbac';

import { ReviewLeaveRequestCommand } from '../../../../application/commands/review-leave-request/review-leave-request.command';
import { EmployeeRole } from '../../../../domain/enums/employee-role.enum';
import { LeaveRequestStatus } from '../../../../domain/enums/leave-request-status.enum';
import {
  EmployeeNotFoundError,
  LeaveRequestNotFoundError,
} from '../../../../domain/errors';
import { UnauthorizedLeaveRequestActionError } from '../../../../domain/errors/unauthorized-leave-request-action.error';

class ReviewLeaveRequestDto {
  @IsIn([LeaveRequestStatus.APPROVED, LeaveRequestStatus.REJECTED])
  @ApiProperty({
    enum: [LeaveRequestStatus.APPROVED, LeaveRequestStatus.REJECTED],
    enumName: 'LeaveRequestStatus',
  })
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED;
}

@Controller('leave-request')
@ApiTags('leave-request')
@Roles(EmployeeRole.MANAGER)
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ReviewLeaveRequestPatchController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  @Patch('/:id')
  async reviewLeaveRequest(
    @AccountParam() accountId: string,
    @Param('id') id: string,
    @Body() body: ReviewLeaveRequestDto,
  ) {
    try {
      await this.commandBus.execute<ReviewLeaveRequestCommand>(
        new ReviewLeaveRequestCommand(id, accountId, body.status),
      );
    } catch (error) {
      this.logger.error('Error reviewing leave request', error);

      if (error instanceof EmployeeNotFoundError) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      if (error instanceof LeaveRequestNotFoundError) {
        throw new HttpException(
          'Leave request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (error instanceof UnauthorizedLeaveRequestActionError) {
        throw new HttpException(
          'Only managers can approve or reject leave requests',
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        'Failed to review leave request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
