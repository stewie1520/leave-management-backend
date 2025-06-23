import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number.parseInt(configService.get('DATABASE_PORT') ?? '5432', 10),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        logger: 'advanced-console',
        ssl:
          configService.get('DATABASE_HOST') === '127.0.0.1'
            ? false
            : configService.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
        synchronize: false,
        dropSchema: false,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
