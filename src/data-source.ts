import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.production`),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'default_user',
  password: process.env.DB_PASS || 'default_pass',
  database: process.env.DB_NAME || 'default_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,

  // 👇 Agregado para que Render acepte la conexión SSL
  ssl: {
    rejectUnauthorized: false,
  },
});
