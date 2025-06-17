import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './core/auth/auth.module';
import { EmployeeModule } from './core/employee/employee.module';

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
