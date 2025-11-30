import { User } from '../../auth/entities/user.entity';
export declare class Blog {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    authorId: string;
}
