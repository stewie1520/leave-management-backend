import { NestMiddleware } from '@nestjs/common';

export abstract class AuthService {
  abstract createAuthMiddleware(): NestMiddleware['use'];
}
