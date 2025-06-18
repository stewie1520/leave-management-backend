import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './core/auth/auth.module';
import { EmployeeModule } from './core/employee/employee.module';
import { AuthService } from './core/auth/application/services/auth.service';

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {
  constructor(private readonly authService: AuthService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.authService.createAuthMiddleware()).forRoutes('*');
  }
}
