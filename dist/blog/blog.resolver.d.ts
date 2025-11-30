import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { User } from '../auth/entities/user.entity';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    createBlog(createBlogInput: CreateBlogInput, context: {
        req: {
            user: User;
        };
    }): Promise<Blog>;
    blogs(): Promise<Blog[]>;
    blog(id: string): Promise<Blog>;
    updateBlog(id: string, updateBlogInput: UpdateBlogInput, context: {
        req: {
            user: User;
        };
    }): Promise<Blog>;
    deleteBlog(id: string, context: {
        req: {
            user: User;
        };
    }): Promise<boolean>;
}
