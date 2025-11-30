import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationQueueService } from '../queue/notification-queue.service';
import { NotificationService } from '../notification.service';
import { BlogService } from '../../blog/blog.service';
export declare class NotificationWorkerService implements OnModuleInit, OnModuleDestroy {
    private queueService;
    private notificationService;
    private blogService;
    private isProcessing;
    private processingInterval;
    private readonly PROCESSING_INTERVAL_MS;
    constructor(queueService: NotificationQueueService, notificationService: NotificationService, blogService: BlogService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startProcessing;
    private stopProcessing;
    private processQueue;
    private processBlogCreatedEvent;
}
