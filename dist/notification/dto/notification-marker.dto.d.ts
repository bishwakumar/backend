import { Blog } from '../../blog/entities/blog.entity';
export declare class NotificationMarkerPayload {
    markerVersion: number;
    blog: Blog;
    createdAt: Date;
    cursor?: number;
}
