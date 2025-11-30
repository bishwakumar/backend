import { Blog } from '../../blog/entities/blog.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    blogs: Blog[];
}
