import { Token } from '../../domain/entities/token.entity';

export abstract class TokenService {
  abstract createToken(accountId: string): Promise<Token>;
  abstract verifyToken(token: string): Promise<Token>;
}
