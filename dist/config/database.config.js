"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
function getDatabaseConfig() {
    const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
    if (databaseUrl) {
        try {
            const url = new URL(databaseUrl);
            return {
                host: url.hostname,
                port: parseInt(url.port || '5432'),
                username: url.username,
                password: url.password,
                database: url.pathname.slice(1),
            };
        }
        catch (error) {
            console.warn('Failed to parse DATABASE_URL, falling back to individual variables');
        }
    }
    const host = process.env.PGHOST ||
        process.env.DB_HOST ||
        'localhost';
    const port = parseInt(process.env.PGPORT ||
        process.env.DB_PORT ||
        '5432');
    const username = process.env.PGUSER ||
        process.env.POSTGRES_USER ||
        process.env.DB_USERNAME ||
        'postgres';
    const password = process.env.PGPASSWORD ||
        process.env.POSTGRES_PASSWORD ||
        process.env.DB_PASSWORD ||
        'postgres';
    const database = process.env.PGDATABASE ||
        process.env.POSTGRES_DB ||
        process.env.DB_NAME ||
        'rpg_blog';
    return { host, port, username, password, database };
}
const dbConfig = getDatabaseConfig();
exports.databaseConfig = {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
};
//# sourceMappingURL=database.config.js.map