import { Module } from '@nestjs/common';
import { HealthController } from './healthcheck.controller';

@Module({
  controllers: [HealthController],
})
export class HealthCheckModule {}
