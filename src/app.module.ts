import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { commands } from './commands';
import { AuthService } from './core/auth/application/services/auth.service';
import { AuthModule } from './core/auth/auth.module';
import { EmployeeModule } from './core/employee/employee.module';
import { DatabaseModule } from './shared/database/database.module';
import { HealthCheckModule } from './shared/healthcheck/healthcheck.module';

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthCheckModule,
  ],
  providers: [...commands],
})
export class AppModule {
  constructor(private readonly authService: AuthService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.authService.createAuthMiddleware()).forRoutes('*');
  }
}
