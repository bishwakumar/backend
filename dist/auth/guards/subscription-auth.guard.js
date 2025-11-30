"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth.service");
let SubscriptionAuthGuard = class SubscriptionAuthGuard {
    constructor(jwtService, authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }
    async canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const connection = ctx.getContext().connection;
        if (!connection || !connection.context) {
            return false;
        }
        const token = connection.context.token;
        if (!token) {
            return false;
        }
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.authService.validateUser(payload.userId);
            if (user) {
                connection.context.user = user;
                return true;
            }
        }
        catch (error) {
            return false;
        }
        return false;
    }
};
SubscriptionAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService])
], SubscriptionAuthGuard);
exports.SubscriptionAuthGuard = SubscriptionAuthGuard;
//# sourceMappingURL=subscription-auth.guard.js.map