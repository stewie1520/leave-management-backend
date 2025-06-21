import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import {
  TokenPayload,
  TokenService,
} from '../../application/services/token.service';
import { Token } from '../../domain/entities/token.entity';
import { TokenModel } from '../repositories/models/token.model';
import { TokenMapper } from '../repositories/models/token.mapper';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly tokenMapper = new TokenMapper();

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async revoke(tokenId: string): Promise<void> {
    await this.dataSource.getRepository(TokenModel).delete(tokenId);
  }

  async createToken(accountId: string) {
    const tokenId = randomUUID();

    const token = Token.create({
      id: tokenId,
      accountId,
      value: this.jwtService.sign(
        { accountId, id: tokenId } satisfies TokenPayload,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
      expiresAt: dayjs()
        .add(
          this.configService.get<number>('JWT_EXPIRATION_SECONDS')!,
          'seconds',
        )
        .toDate(),
    });

    const model = this.tokenMapper.toModel(token);

    await this.dataSource.getRepository(TokenModel).save(model);

    return token;
  }

  async verifyToken(token: string): Promise<Token> {
    const decoded = this.jwtService.verify<{ accountId: string; id: string }>(
      token,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    const tokenModel = await this.dataSource.getRepository(TokenModel).findOne({
      where: { id: decoded.id },
    });

    if (!tokenModel) {
      throw new Error('Token not found');
    }

    const entity = this.tokenMapper.toEntity(tokenModel);

    if (entity.isExpired) {
      throw new Error('Token not found');
    }

    return entity;
  }
}
