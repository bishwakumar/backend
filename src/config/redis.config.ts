import { RedisOptions } from 'ioredis';

/**
 * Get Redis configuration from environment variables
 * Supports Railway format (REDISHOST, REDISPORT, etc.) and REDIS_URL connection string
 * Returns either a connection string or RedisOptions object
 */
export function getRedisConfig(): string | RedisOptions {
  // Try REDIS_URL or REDIS_PUBLIC_URL connection string first
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_PUBLIC_URL;
  if (redisUrl) {
    return redisUrl;
  }

  // Railway Redis variables (REDIS* or individual components)
  const host =
    process.env.REDISHOST ||
    process.env.REDIS_HOST ||
    'localhost';
  
  const port = parseInt(
    process.env.REDISPORT ||
    process.env.REDIS_PORT ||
    '6379'
  );
  
  const password =
    process.env.REDISPASSWORD ||
    process.env.REDIS_PASSWORD ||
    undefined;
  
  const username =
    process.env.REDISUSER ||
    undefined;

  // Return options object
  return {
    host,
    port,
    password: password || undefined,
    username: username || undefined,
  };
}

