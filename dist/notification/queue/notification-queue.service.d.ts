import { OnModuleInit } from '@nestjs/common';
export interface BlogCreatedEvent {
    blogId: string;
    title: string;
    authorId: string;
    createdAt: Date;
}
export declare class NotificationQueueService implements OnModuleInit {
    private redis;
    private readonly QUEUE_NAME;
    constructor();
    onModuleInit(): Promise<void>;
    enqueueBlogCreatedEvent(event: BlogCreatedEvent): Promise<void>;
    dequeueBlogCreatedEvent(timeout?: number): Promise<BlogCreatedEvent | null>;
    getQueueLength(): Promise<number>;
}
