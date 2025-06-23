import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['src/**/*.model{.ts,.js}'],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/src/migrations/*.js']
      : ['src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
