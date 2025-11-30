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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_input_1 = require("./dto/register.input");
const login_input_1 = require("./dto/login.input");
const auth_response_1 = require("./dto/auth.response");
const notification_service_1 = require("../notification/notification.service");
const notification_marker_entity_1 = require("../notification/entities/notification-marker.entity");
const user_notification_state_entity_1 = require("../notification/entities/user-notification-state.entity");
const unread_count_response_dto_1 = require("../notification/dto/unread-count-response.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const user_entity_1 = require("./entities/user.entity");
let AuthResolver = class AuthResolver {
    constructor(authService, notificationService) {
        this.authService = authService;
        this.notificationService = notificationService;
    }
    async register(registerInput) {
        return this.authService.register(registerInput);
    }
    async login(loginInput) {
        return this.authService.login(loginInput);
    }
    async me(context) {
        return context.req.user;
    }
    async unreadMarkers(context) {
        return this.notificationService.getUnreadMarkers(context.req.user);
    }
    async allMarkers(context) {
        return this.notificationService.getAllMarkers(context.req.user);
    }
    async notificationState(context) {
        return this.notificationService.getUserState(context.req.user);
    }
    async unreadNotificationCount(context) {
        return this.notificationService.getUnreadCount(context.req.user);
    }
    async updateLastSeenMarkerVersion(markerVersion, context) {
        const userState = await this.notificationService.markAsSeen(context.req.user, markerVersion);
        const count = await this.notificationService.getUnreadCount(context.req.user);
        return {
            count,
            lastSeenMarkerVersion: userState.lastSeenMarkerVersion,
        };
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => auth_response_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_input_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_response_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.User),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Query)(() => [notification_marker_entity_1.NotificationMarker]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "unreadMarkers", null);
__decorate([
    (0, graphql_1.Query)(() => [notification_marker_entity_1.NotificationMarker]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "allMarkers", null);
__decorate([
    (0, graphql_1.Query)(() => user_notification_state_entity_1.UserNotificationState),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "notificationState", null);
__decorate([
    (0, graphql_1.Query)(() => graphql_1.Int),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "unreadNotificationCount", null);
__decorate([
    (0, graphql_1.Mutation)(() => unread_count_response_dto_1.UnreadCountResponse),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('markerVersion', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updateLastSeenMarkerVersion", null);
AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        notification_service_1.NotificationService])
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=auth.resolver.js.map