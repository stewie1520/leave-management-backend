import { Injectable, NestMiddleware } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

import {
  TokenPayload,
  TokenService,
} from '../../application/services/token.service';
import { AuthService } from '../../application/services/auth.service';

@Injectable()
export class AuthProvider extends AuthService {
  constructor(private tokenService: TokenService) {
    super();
  }

  createAuthMiddleware(): NestMiddleware['use'] {
    return async (req: Request & { token?: TokenPayload }, res, next) => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      if (!token) {
        return next();
      }

      const decoded = await this.tokenService.verifyToken(token);

      if (!decoded) {
        return next();
      }

      req.token = {
        accountId: decoded.accountId,
        id: decoded.id,
      };

      next();
    };
  }
}
