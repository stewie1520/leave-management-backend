import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/core/auth/application/services/token.service';

export const AccountParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ token?: TokenPayload }>();

    return request.token?.accountId;
  },
);
