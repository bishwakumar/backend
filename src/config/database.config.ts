import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Parse database configuration from environment variables
 * Supports Railway format (PGHOST, PGPORT, etc.) and DATABASE_URL connection string
 */
function getDatabaseConfig(): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} {
  // Try DATABASE_URL or DATABASE_PUBLIC_URL connection string first
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '5432'),
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading '/'
      };
    } catch (error) {
      console.warn('Failed to parse DATABASE_URL, falling back to individual variables');
    }
  }

  // Railway PostgreSQL variables (PG*)
  const host =
    process.env.PGHOST ||
    process.env.DB_HOST ||
    'localhost';
  
  const port = parseInt(
    process.env.PGPORT ||
    process.env.DB_PORT ||
    '5432'
  );
  
  const username =
    process.env.PGUSER ||
    process.env.POSTGRES_USER ||
    process.env.DB_USERNAME ||
    'postgres';
  
  const password =
    process.env.PGPASSWORD ||
    process.env.POSTGRES_PASSWORD ||
    process.env.DB_PASSWORD ||
    'postgres';
  
  const database =
    process.env.PGDATABASE ||
    process.env.POSTGRES_DB ||
    process.env.DB_NAME ||
    'rpg_blog';

  return { host, port, username, password, database };
}

const dbConfig = getDatabaseConfig();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
  logging: process.env.NODE_ENV === 'development',
};

