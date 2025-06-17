import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/shared/database/database.module';
import { LoginCommandHandler } from './application/commands/login/login.command';
import { AccountRepository } from './application/repositories/account.repository';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { LoginPostController } from './infrastructure/controllers/login-post/login-post.controller';
import { AccountModel } from './infrastructure/repositories/models/account.model';
import { TokenModel } from './infrastructure/repositories/models/token.model';
import { SqlAccountRepository } from './infrastructure/repositories/sql-account.repository';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { BcryptPasswordService } from './infrastructure/services/password.service';
import { JwtModule } from '@nestjs/jwt';

const controllers = [LoginPostController];
const commands = [LoginCommandHandler];

const repositories = [
  {
    provide: AccountRepository,
    useClass: SqlAccountRepository,
  },
];

const services = [
  {
    provide: TokenService,
    useClass: JwtTokenService,
  },
  {
    provide: PasswordService,
    useClass: BcryptPasswordService,
  },
];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AccountModel, TokenModel]),
    DatabaseModule,
  ],
  controllers,
  providers: [...repositories, ...services, ...commands, Logger],
})
export class AuthModule {}
