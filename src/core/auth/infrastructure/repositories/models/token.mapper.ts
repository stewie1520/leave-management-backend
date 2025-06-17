import { Token } from 'src/core/auth/domain/entities/token.entity';
import { TokenModel } from './token.model';

export class TokenMapper {
  toModel(token: Token): TokenModel {
    return new TokenModel({
      id: token.id,
      accountId: token.accountId,
      value: token.value,
      expiresAt: token.expiresAt,
    });
  }

  toEntity(model: TokenModel): Token {
    return Token.create({
      id: model.id,
      accountId: model.accountId,
      value: model.value,
      expiresAt: model.expiresAt,
    });
  }
}
