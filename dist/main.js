"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                    callback(null, true);
                    return;
                }
            }
            const allowedOrigins = [
                process.env.FRONTEND_URL,
                'http://localhost:3000',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
            ].filter(Boolean);
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.warn(`CORS blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'X-Requested-With',
            'Origin',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Methods',
        ],
        exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(process.env.PORT || 3200);
    console.log(`Server is running on: http://localhost:${process.env.PORT || 3200}`);
    console.log(`GraphQL endpoint: http://localhost:${process.env.PORT || 3200}/graphql`);
}
bootstrap();
//# sourceMappingURL=main.js.map