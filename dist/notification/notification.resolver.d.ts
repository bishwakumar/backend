import { NotificationService } from './notification.service';
export declare class NotificationResolver {
    private notificationService;
    constructor(notificationService: NotificationService);
    subscribeToNewMarkers(cursor?: number, context?: any): AsyncIterator<unknown, any, undefined>;
}
