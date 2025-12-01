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
exports.NotificationQueueService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_config_1 = require("../../config/redis.config");
let NotificationQueueService = class NotificationQueueService {
    constructor() {
        this.QUEUE_NAME = 'blog_created_events';
        const baseRedisConfig = (0, redis_config_1.getRedisConfig)();
        const commonOptions = {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 30000);
                return delay;
            },
        };
        if (typeof baseRedisConfig === 'string') {
            this.redis = new ioredis_1.Redis(baseRedisConfig, commonOptions);
        }
        else {
            this.redis = new ioredis_1.Redis(Object.assign(Object.assign({}, baseRedisConfig), commonOptions));
        }
        this.redis.on('error', (err) => {
            console.error('Notification Queue Redis error:', err);
        });
        this.redis.on('connect', () => {
        });
    }
    async onModuleInit() {
    }
    async enqueueBlogCreatedEvent(event) {
        try {
            await this.redis.lpush(this.QUEUE_NAME, JSON.stringify(event));
        }
        catch (error) {
            console.error('Error enqueueing blog created event:', error);
            throw error;
        }
    }
    async dequeueBlogCreatedEvent(timeout = 5) {
        try {
            const result = await this.redis.brpop(this.QUEUE_NAME, timeout);
            if (result && result[1]) {
                return JSON.parse(result[1]);
            }
            return null;
        }
        catch (error) {
            console.error('Error dequeueing blog created event:', error);
            return null;
        }
    }
    async getQueueLength() {
        try {
            return await this.redis.llen(this.QUEUE_NAME);
        }
        catch (error) {
            console.error('Error getting queue length:', error);
            return 0;
        }
    }
};
NotificationQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationQueueService);
exports.NotificationQueueService = NotificationQueueService;
//# sourceMappingURL=notification-queue.service.js.map