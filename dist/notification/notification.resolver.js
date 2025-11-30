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
exports.NotificationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const notification_service_1 = require("./notification.service");
const notification_marker_dto_1 = require("./dto/notification-marker.dto");
const createDefaultPayload = () => {
    return {
        markerVersion: 0,
        blog: null,
        createdAt: new Date(),
        cursor: 0,
    };
};
const safeResolvePayload = (payload) => {
    if (!payload || typeof payload !== 'object') {
        console.warn('⚠️ [RESOLVER] Received invalid payload, using default:', payload);
        return createDefaultPayload();
    }
    const hasMarkerVersion = typeof payload.markerVersion === 'number' &&
        payload.markerVersion > 0;
    const hasBlog = payload.blog && typeof payload.blog === 'object';
    const hasCreatedAt = payload.createdAt instanceof Date;
    if (!hasMarkerVersion || !hasBlog || !hasCreatedAt) {
        console.warn('⚠️ [RESOLVER] Payload missing required fields, using default:', {
            hasMarkerVersion,
            hasBlog,
            hasCreatedAt,
            payload,
        });
        return createDefaultPayload();
    }
    return {
        markerVersion: payload.markerVersion,
        blog: payload.blog,
        createdAt: payload.createdAt,
        cursor: payload.markerVersion,
    };
};
let NotificationResolver = class NotificationResolver {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    subscribeToNewMarkers(cursor, context) {
        var _a, _b, _c;
        const pubSub = this.notificationService.getPubSub();
        if (!pubSub) {
            console.error('PubSub instance is null!');
            throw new Error('PubSub instance not available');
        }
        try {
            const user = ((_b = (_a = context === null || context === void 0 ? void 0 : context.connection) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.user) || ((_c = context === null || context === void 0 ? void 0 : context.req) === null || _c === void 0 ? void 0 : _c.user) || (context === null || context === void 0 ? void 0 : context.user);
            const userId = (user === null || user === void 0 ? void 0 : user.id) ? String(user.id).trim() : null;
            const asyncIterator = pubSub.asyncIterator('newNotificationMarker');
            if (!asyncIterator) {
                console.error('AsyncIterator is null!');
                throw new Error('Failed to create asyncIterator');
            }
            return asyncIterator;
        }
        catch (error) {
            console.error('Error creating asyncIterator:', error);
            throw error;
        }
    }
};
__decorate([
    (0, graphql_1.Subscription)(() => notification_marker_dto_1.NotificationMarkerPayload, {
        name: 'newNotificationMarker',
        filter: (payload, variables, context) => {
            let actualPayload = payload;
            if ((payload === null || payload === void 0 ? void 0 : payload.newNotificationMarker) !== undefined) {
                actualPayload = payload.newNotificationMarker;
            }
            if ((variables === null || variables === void 0 ? void 0 : variables.cursor) !== undefined && variables.cursor !== null) {
                const markerVersion = actualPayload === null || actualPayload === void 0 ? void 0 : actualPayload.markerVersion;
                if (typeof markerVersion !== 'number') {
                    console.warn('⚠️ [RESOLVER] Invalid markerVersion in payload for cursor filter:', markerVersion);
                    return false;
                }
                return markerVersion > variables.cursor;
            }
            return true;
        },
        resolve: (payload) => {
            let actualPayload = payload;
            if ((payload === null || payload === void 0 ? void 0 : payload.newNotificationMarker) !== undefined) {
                actualPayload = payload.newNotificationMarker;
            }
            const resolvedPayload = safeResolvePayload(actualPayload);
            if (!resolvedPayload.cursor && resolvedPayload.markerVersion > 0) {
                resolvedPayload.cursor = resolvedPayload.markerVersion;
            }
            return resolvedPayload;
        },
    }),
    __param(0, (0, graphql_1.Args)('cursor', { type: () => graphql_1.Int, nullable: true })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NotificationResolver.prototype, "subscribeToNewMarkers", null);
NotificationResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationResolver);
exports.NotificationResolver = NotificationResolver;
//# sourceMappingURL=notification.resolver.js.map