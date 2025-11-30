import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import { NotificationService } from '../notification/notification.service';
import { NotificationMarker } from '../notification/entities/notification-marker.entity';
import { UserNotificationState } from '../notification/entities/user-notification-state.entity';
import { UnreadCountResponse } from '../notification/dto/unread-count-response.dto';
import { User } from './entities/user.entity';
export declare class AuthResolver {
    private authService;
    private notificationService;
    constructor(authService: AuthService, notificationService: NotificationService);
    register(registerInput: RegisterInput): Promise<AuthResponse>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    me(context: {
        req: {
            user: User;
        };
    }): Promise<User>;
    unreadMarkers(context: {
        req: {
            user: User;
        };
    }): Promise<NotificationMarker[]>;
    allMarkers(context: {
        req: {
            user: User;
        };
    }): Promise<NotificationMarker[]>;
    notificationState(context: {
        req: {
            user: User;
        };
    }): Promise<UserNotificationState>;
    unreadNotificationCount(context: {
        req: {
            user: User;
        };
    }): Promise<number>;
    updateLastSeenMarkerVersion(markerVersion: number, context: {
        req: {
            user: User;
        };
    }): Promise<UnreadCountResponse>;
}
