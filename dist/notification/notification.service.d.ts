import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Blog } from '../blog/entities/blog.entity';
import { NotificationMarker } from './entities/notification-marker.entity';
import { UserNotificationState } from './entities/user-notification-state.entity';
import { User } from '../auth/entities/user.entity';
export declare class NotificationService implements OnModuleInit, OnModuleDestroy {
    private markerRepository;
    private userStateRepository;
    private userRepository;
    private pubSub;
    private redis;
    private redisSubscriber;
    private readonly NOTIFICATION_CHANNEL;
    constructor(markerRepository: Repository<NotificationMarker>, userStateRepository: Repository<UserNotificationState>, userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private safePublishMarker;
    private safePublishToRedis;
    createMarker(blog: Blog): Promise<NotificationMarker>;
    getUnreadMarkers(user: User): Promise<NotificationMarker[]>;
    getAllMarkers(user: User): Promise<NotificationMarker[]>;
    markAsSeen(user: User, markerVersion: number): Promise<UserNotificationState>;
    getUserState(user: User): Promise<UserNotificationState>;
    getUnreadCount(user: User): Promise<number>;
    getPubSub(): PubSub;
}
