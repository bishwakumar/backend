import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { User } from '../auth/entities/user.entity';
import { NotificationQueueService } from '../notification/queue/notification-queue.service';
export declare class BlogService {
    private blogRepository;
    private notificationQueue;
    constructor(blogRepository: Repository<Blog>, notificationQueue: NotificationQueueService);
    create(createBlogInput: CreateBlogInput, author: User): Promise<Blog>;
    findAll(): Promise<Blog[]>;
    findOne(id: string): Promise<Blog>;
    update(id: string, updateBlogInput: UpdateBlogInput, user: User): Promise<Blog>;
    remove(id: string, user: User): Promise<boolean>;
}
