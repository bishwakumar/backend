"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = void 0;
function getRedisConfig() {
    const redisUrl = process.env.REDIS_URL || process.env.REDIS_PUBLIC_URL;
    if (redisUrl) {
        return redisUrl;
    }
    const host = process.env.REDISHOST ||
        process.env.REDIS_HOST ||
        'localhost';
    const port = parseInt(process.env.REDISPORT ||
        process.env.REDIS_PORT ||
        '6379');
    const password = process.env.REDISPASSWORD ||
        process.env.REDIS_PASSWORD ||
        undefined;
    const username = process.env.REDISUSER ||
        undefined;
    return {
        host,
        port,
        password: password || undefined,
        username: username || undefined,
    };
}
exports.getRedisConfig = getRedisConfig;
//# sourceMappingURL=redis.config.js.map