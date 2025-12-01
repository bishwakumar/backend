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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ioredis_1 = require("ioredis");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const notification_marker_entity_1 = require("./entities/notification-marker.entity");
const user_notification_state_entity_1 = require("./entities/user-notification-state.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const redis_config_1 = require("../config/redis.config");
let NotificationService = class NotificationService {
    constructor(markerRepository, userStateRepository, userRepository) {
        this.markerRepository = markerRepository;
        this.userStateRepository = userStateRepository;
        this.userRepository = userRepository;
        this.NOTIFICATION_CHANNEL = 'new_blog_notifications';
        this.pubSub = new graphql_subscriptions_1.PubSub();
        const baseRedisConfig = (0, redis_config_1.getRedisConfig)();
        const commonOptions = {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 30000);
                return delay;
            },
            reconnectOnError: (err) => {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
        };
        if (typeof baseRedisConfig === 'string') {
            this.redis = new ioredis_1.Redis(baseRedisConfig, commonOptions);
        }
        else {
            this.redis = new ioredis_1.Redis(Object.assign(Object.assign({}, baseRedisConfig), commonOptions));
        }
        if (typeof baseRedisConfig === 'string') {
            this.redisSubscriber = new ioredis_1.Redis(baseRedisConfig, commonOptions);
        }
        else {
            this.redisSubscriber = new ioredis_1.Redis(Object.assign(Object.assign({}, baseRedisConfig), commonOptions));
        }
        this.redis.on('error', (err) => {
            console.error('Redis publisher error:', err);
        });
        this.redis.on('connect', () => {
        });
        this.redisSubscriber.on('error', (err) => {
            console.error('Redis subscriber error:', err);
        });
        this.redisSubscriber.on('connect', () => {
        });
    }
    async onModuleInit() {
        try {
            await this.redisSubscriber.subscribe(this.NOTIFICATION_CHANNEL);
            this.redisSubscriber.on('message', async (channel, message) => {
                if (channel === this.NOTIFICATION_CHANNEL) {
                    try {
                        const parsedMarker = JSON.parse(message);
                        const markerPayload = {
                            markerVersion: parsedMarker.markerVersion,
                            blog: Object.assign(Object.assign({}, parsedMarker.blog), { createdAt: new Date(parsedMarker.blog.createdAt), updatedAt: new Date(parsedMarker.blog.updatedAt), authorId: parsedMarker.blog.authorId, author: parsedMarker.blog.author
                                    ? Object.assign(Object.assign({}, parsedMarker.blog.author), { id: parsedMarker.blog.author.id, createdAt: new Date(parsedMarker.blog.author.createdAt), updatedAt: new Date(parsedMarker.blog.author.updatedAt) }) : undefined }),
                            createdAt: new Date(parsedMarker.createdAt),
                            cursor: parsedMarker.markerVersion || parsedMarker.cursor,
                        };
                        await this.safePublishMarker(markerPayload);
                    }
                    catch (error) {
                        console.error('Error parsing or publishing marker message:', error);
                    }
                }
            });
        }
        catch (error) {
            console.error('Error initializing Redis subscriber:', error);
        }
    }
    async onModuleDestroy() {
        try {
            if (this.redisSubscriber && this.redisSubscriber.status === 'ready') {
                await this.redisSubscriber.unsubscribe(this.NOTIFICATION_CHANNEL);
                await this.redisSubscriber.quit();
            }
            if (this.redis && this.redis.status === 'ready') {
                await this.redis.quit();
            }
        }
        catch (error) {
            console.error('Error closing Redis connections:', error);
        }
    }
    async safePublishMarker(payload) {
        var _a;
        if (!payload) {
            throw new Error('Cannot publish null or undefined payload');
        }
        if (typeof payload.markerVersion !== 'number' || payload.markerVersion <= 0) {
            throw new Error(`Invalid markerVersion: ${payload.markerVersion}. Must be a positive number.`);
        }
        if (!payload.blog || typeof payload.blog !== 'object') {
            throw new Error('Invalid blog: must be a valid Blog object');
        }
        if (!payload.blog.id) {
            throw new Error('Invalid blog: missing id field');
        }
        const authorId = ((_a = payload.blog.author) === null || _a === void 0 ? void 0 : _a.id) || payload.blog.authorId;
        if (!authorId) {
            throw new Error('Invalid blog: missing author information (author.id or authorId) - required for notification filtering');
        }
        if (!(payload.createdAt instanceof Date)) {
            throw new Error('Invalid createdAt: must be a Date object');
        }
        try {
            await this.pubSub.publish('newNotificationMarker', payload);
        }
        catch (error) {
            console.error('Error publishing to local PubSub:', error);
            throw error;
        }
    }
    async safePublishToRedis(payload) {
        try {
            const redisPayload = {
                markerVersion: payload.markerVersion,
                blog: {
                    id: payload.blog.id,
                    title: payload.blog.title,
                    content: payload.blog.content,
                    createdAt: payload.blog.createdAt.toISOString(),
                    updatedAt: payload.blog.updatedAt.toISOString(),
                    authorId: payload.blog.authorId,
                    author: payload.blog.author
                        ? {
                            id: payload.blog.author.id,
                            email: payload.blog.author.email,
                            username: payload.blog.author.username,
                            createdAt: payload.blog.author.createdAt.toISOString(),
                            updatedAt: payload.blog.author.updatedAt.toISOString(),
                        }
                        : undefined,
                },
                createdAt: payload.createdAt.toISOString(),
                cursor: payload.cursor || payload.markerVersion,
            };
            await this.redis.publish(this.NOTIFICATION_CHANNEL, JSON.stringify(redisPayload));
        }
        catch (error) {
            console.error('❌ Error publishing to Redis:', error);
        }
    }
    async createMarker(blog) {
        var _a, _b;
        const marker = this.markerRepository.create({
            blog,
            blogId: blog.id,
        });
        const savedMarker = await this.markerRepository.save(marker);
        const markerWithBlog = await this.markerRepository.findOne({
            where: { markerVersion: savedMarker.markerVersion },
            relations: ['blog', 'blog.author'],
        });
        if (!markerWithBlog) {
            throw new Error('Failed to load marker with blog');
        }
        if (!markerWithBlog.blog) {
            throw new Error('Failed to load blog relation for marker');
        }
        if (!markerWithBlog.blog.author) {
            console.warn('⚠️ [BACKEND] Blog author not loaded, attempting to reload...');
            const reloadedMarker = await this.markerRepository.findOne({
                where: { markerVersion: savedMarker.markerVersion },
                relations: ['blog', 'blog.author'],
            });
            if ((_a = reloadedMarker === null || reloadedMarker === void 0 ? void 0 : reloadedMarker.blog) === null || _a === void 0 ? void 0 : _a.author) {
                markerWithBlog.blog = reloadedMarker.blog;
            }
            else {
                throw new Error('Failed to load blog author relation - required for notification filtering');
            }
        }
        if (markerWithBlog.blog.author && !markerWithBlog.blog.authorId) {
            markerWithBlog.blog.authorId = markerWithBlog.blog.author.id;
        }
        const markerPayload = {
            markerVersion: markerWithBlog.markerVersion,
            blog: Object.assign(Object.assign({}, markerWithBlog.blog), { author: markerWithBlog.blog.author, authorId: markerWithBlog.blog.authorId || ((_b = markerWithBlog.blog.author) === null || _b === void 0 ? void 0 : _b.id) }),
            createdAt: markerWithBlog.createdAt,
            cursor: markerWithBlog.markerVersion,
        };
        await this.safePublishMarker(markerPayload);
        await this.safePublishToRedis(markerPayload);
        return markerWithBlog;
    }
    async getUnreadMarkers(user) {
        let userState = await this.userStateRepository.findOne({
            where: { userId: user.id },
        });
        if (!userState) {
            userState = this.userStateRepository.create({
                userId: user.id,
                lastSeenMarkerVersion: 0,
            });
            await this.userStateRepository.save(userState);
        }
        const markers = await this.markerRepository.find({
            where: {
                markerVersion: (0, typeorm_2.MoreThan)(userState.lastSeenMarkerVersion),
            },
            relations: ['blog', 'blog.author'],
            order: { markerVersion: 'ASC' },
        });
        return markers;
    }
    async getAllMarkers(user) {
        const freshUser = await this.userRepository.findOne({
            where: { id: user.id },
            select: ['id', 'email', 'username', 'createdAt']
        });
        if (!freshUser || !freshUser.createdAt) {
            console.error(`User ${user.id} not found or has no createdAt date`);
            return [];
        }
        const userCreatedAt = freshUser.createdAt instanceof Date
            ? new Date(freshUser.createdAt.getTime() - 1000)
            : new Date(new Date(freshUser.createdAt).getTime() - 1000);
        console.log(`Filtering markers for user ${freshUser.id} (registered: ${freshUser.createdAt.toISOString()}, filter date: ${userCreatedAt.toISOString()})`);
        const markers = await this.markerRepository
            .createQueryBuilder('marker')
            .leftJoinAndSelect('marker.blog', 'blog')
            .leftJoinAndSelect('blog.author', 'author')
            .where('blog.createdAt > :userCreatedAt', { userCreatedAt: userCreatedAt })
            .orderBy('marker.markerVersion', 'DESC')
            .getMany();
        console.log(`Found ${markers.length} markers for user ${freshUser.id} after registration date`);
        if (markers.length > 0) {
            console.log(`Sample blog dates: ${markers.slice(0, 3).map(m => m.blog.createdAt.toISOString()).join(', ')}`);
        }
        return markers;
    }
    async markAsSeen(user, markerVersion) {
        let userState = await this.userStateRepository.findOne({
            where: { userId: user.id },
        });
        if (!userState) {
            userState = this.userStateRepository.create({
                userId: user.id,
                lastSeenMarkerVersion: markerVersion,
            });
        }
        else {
            userState.lastSeenMarkerVersion = Math.max(userState.lastSeenMarkerVersion, markerVersion);
        }
        return this.userStateRepository.save(userState);
    }
    async getUserState(user) {
        let userState = await this.userStateRepository.findOne({
            where: { userId: user.id },
        });
        if (!userState) {
            userState = this.userStateRepository.create({
                userId: user.id,
                lastSeenMarkerVersion: 0,
            });
            await this.userStateRepository.save(userState);
        }
        return userState;
    }
    async getUnreadCount(user) {
        let userState = await this.userStateRepository.findOne({
            where: { userId: user.id },
        });
        if (!userState) {
            userState = this.userStateRepository.create({
                userId: user.id,
                lastSeenMarkerVersion: 0,
            });
            await this.userStateRepository.save(userState);
        }
        const freshUser = await this.userRepository.findOne({
            where: { id: user.id },
            select: ['id', 'createdAt']
        });
        if (!freshUser || !freshUser.createdAt) {
            console.error(`User ${user.id} not found or has no createdAt date`);
            return 0;
        }
        const userCreatedAt = freshUser.createdAt instanceof Date
            ? new Date(freshUser.createdAt.getTime() - 1000)
            : new Date(new Date(freshUser.createdAt).getTime() - 1000);
        const count = await this.markerRepository
            .createQueryBuilder('marker')
            .leftJoin('marker.blog', 'blog')
            .where('marker.markerVersion > :lastSeenMarkerVersion', {
            lastSeenMarkerVersion: userState.lastSeenMarkerVersion
        })
            .andWhere('blog.createdAt > :userCreatedAt', {
            userCreatedAt: userCreatedAt
        })
            .getCount();
        return count;
    }
    getPubSub() {
        return this.pubSub;
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_marker_entity_1.NotificationMarker)),
    __param(1, (0, typeorm_1.InjectRepository)(user_notification_state_entity_1.UserNotificationState)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map