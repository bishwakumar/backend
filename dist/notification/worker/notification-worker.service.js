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
exports.NotificationWorkerService = void 0;
const common_1 = require("@nestjs/common");
const notification_queue_service_1 = require("../queue/notification-queue.service");
const notification_service_1 = require("../notification.service");
const blog_service_1 = require("../../blog/blog.service");
let NotificationWorkerService = class NotificationWorkerService {
    constructor(queueService, notificationService, blogService) {
        this.queueService = queueService;
        this.notificationService = notificationService;
        this.blogService = blogService;
        this.isProcessing = false;
        this.processingInterval = null;
        this.PROCESSING_INTERVAL_MS = 100;
    }
    async onModuleInit() {
        this.startProcessing();
    }
    async onModuleDestroy() {
        this.stopProcessing();
    }
    startProcessing() {
        if (this.isProcessing) {
            return;
        }
        this.isProcessing = true;
        this.processQueue();
    }
    stopProcessing() {
        this.isProcessing = false;
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
    }
    async processQueue() {
        if (!this.isProcessing) {
            return;
        }
        try {
            const event = await this.queueService.dequeueBlogCreatedEvent(1);
            if (event) {
                await this.processBlogCreatedEvent(event);
            }
        }
        catch (error) {
            console.error('Error processing queue:', error);
        }
        finally {
            if (this.isProcessing) {
                this.processingInterval = setTimeout(() => {
                    this.processQueue();
                }, this.PROCESSING_INTERVAL_MS);
            }
        }
    }
    async processBlogCreatedEvent(event) {
        try {
            const blog = await this.blogService.findOne(event.blogId);
            if (!blog) {
                console.error(`Blog not found: ${event.blogId}`);
                return;
            }
            await this.notificationService.createMarker(blog);
        }
        catch (error) {
            console.error(`Error processing blog created event ${event.blogId}:`, error);
            throw error;
        }
    }
};
NotificationWorkerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_queue_service_1.NotificationQueueService,
        notification_service_1.NotificationService,
        blog_service_1.BlogService])
], NotificationWorkerService);
exports.NotificationWorkerService = NotificationWorkerService;
//# sourceMappingURL=notification-worker.service.js.map