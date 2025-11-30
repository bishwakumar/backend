"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./auth/auth.module");
const blog_module_1 = require("./blog/blog.module");
const notification_module_1 = require("./notification/notification.module");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth/auth.service");
async function handleSubscriptionConnect(connectionParams, jwtService, authService) {
    let token = null;
    if (connectionParams === null || connectionParams === void 0 ? void 0 : connectionParams.authorization) {
        token = connectionParams.authorization.replace('Bearer ', '');
    }
    else if (connectionParams === null || connectionParams === void 0 ? void 0 : connectionParams.token) {
        token = connectionParams.token;
    }
    if (token) {
        try {
            const payload = jwtService.verify(token);
            const user = await authService.validateUser(payload.userId);
            if (user) {
                return { token, user };
            }
            else {
                console.warn('User not found for userId:', payload.userId);
                return { token: null, user: null };
            }
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return { token: null, user: null };
        }
    }
    return { token: null, user: null };
}
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(database_config_1.databaseConfig),
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                imports: [
                    notification_module_1.NotificationModule,
                    auth_module_1.AuthModule,
                    jwt_1.JwtModule.register({
                        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                        signOptions: { expiresIn: '7d' },
                    }),
                ],
                inject: [jwt_1.JwtService, auth_service_1.AuthService],
                useFactory: (jwtService, authService) => ({
                    autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                    subscriptions: {
                        'graphql-ws': {
                            path: '/graphql',
                            onConnect: async (context) => {
                                return handleSubscriptionConnect(context.connectionParams, jwtService, authService);
                            },
                        },
                        'subscriptions-transport-ws': {
                            path: '/graphql',
                            onConnect: async (connectionParams) => {
                                return handleSubscriptionConnect(connectionParams, jwtService, authService);
                            },
                        },
                    },
                    context: ({ req, connection }) => {
                        var _a;
                        if (connection) {
                            const user = ((_a = connection.context) === null || _a === void 0 ? void 0 : _a.user) || null;
                            const subscriptionContext = {
                                req: req || { user: user },
                                connection: connection,
                            };
                            if (subscriptionContext.req && !subscriptionContext.req.user && user) {
                                subscriptionContext.req.user = user;
                            }
                            return subscriptionContext;
                        }
                        return { req: req || {} };
                    },
                    installSubscriptionHandlers: true,
                }),
            }),
            auth_module_1.AuthModule,
            blog_module_1.BlogModule,
            notification_module_1.NotificationModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map