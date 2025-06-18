import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginCommand } from 'src/core/auth/application/commands/login/login.command';
import { Token } from 'src/core/auth/domain/entities/token.entity';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

class LoginResponseDto {
  value: string;
  expiresAt: Date;
  accountId: string;

  constructor(token: Token) {
    this.value = token.value;
    this.expiresAt = token.expiresAt;
    this.accountId = token.accountId;
  }
}

@Controller('auth')
@ApiTags('auth')
export class LoginPostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const token = await this.commandBus.execute<LoginCommand, Token>(
        new LoginCommand(loginDto.email, loginDto.password),
      );

      return new LoginResponseDto(token);
    } catch (error) {
      this.logger.log('Error logging in', error);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
