import { Token } from '../../domain/entities/token.entity';

export type TokenPayload = {
  accountId: string;
  id: string;
};

export abstract class TokenService {
  abstract createToken(accountId: string): Promise<Token>;
  abstract verifyToken(token: string): Promise<Token>;
}
