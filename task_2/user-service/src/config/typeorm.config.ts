import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'user_service',
  entities: [path.join(__dirname, '..', '**', '*.entity.{js,ts}')],
  migrations: [path.join(__dirname, '..', 'migrations', '**', '*{.js,.ts}')],
  synchronize: false,
});
