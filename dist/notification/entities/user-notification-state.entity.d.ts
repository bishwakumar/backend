import { User } from '../../auth/entities/user.entity';
export declare class UserNotificationState {
    userId: string;
    user: User;
    lastSeenMarkerVersion: number;
    updatedAt: Date;
}
