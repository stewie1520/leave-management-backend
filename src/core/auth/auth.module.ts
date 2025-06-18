import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginCommandHandler } from './application/commands/login/login.command';
import { AccountRepository } from './application/repositories/account.repository';
import { AuthService } from './application/services/auth.service';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { LoginPostController } from './infrastructure/controllers/login-post/login-post.controller';
import { AccountModel } from './infrastructure/repositories/models/account.model';
import { TokenModel } from './infrastructure/repositories/models/token.model';
import { SqlAccountRepository } from './infrastructure/repositories/sql-account.repository';
import { AuthProvider } from './infrastructure/services/auth.provider';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { BcryptPasswordService } from './infrastructure/services/password.service';
import { DatabaseError } from 'pg';
import { DatabaseModule } from 'src/shared/database/database.module';

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
  {
    provide: AuthService,
    useClass: AuthProvider,
  },
];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AccountModel, TokenModel]),
  ],
  controllers,
  providers: [...repositories, ...services, ...commands, Logger],
  exports: [AuthService, AccountRepository, PasswordService],
})
export class AuthModule {}
