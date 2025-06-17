import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccountParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: { accountId: string } }>();

    return request.user?.accountId;
  },
);
