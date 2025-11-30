"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./entities/blog.entity");
const notification_queue_service_1 = require("../notification/queue/notification-queue.service");
let BlogService = class BlogService {
    constructor(blogRepository, notificationQueue) {
        this.blogRepository = blogRepository;
        this.notificationQueue = notificationQueue;
    }
    async create(createBlogInput, author) {
        const blog = this.blogRepository.create(Object.assign(Object.assign({}, createBlogInput), { author, authorId: author.id }));
        const savedBlog = await this.blogRepository.save(blog);
        const blogWithAuthor = await this.blogRepository.findOne({
            where: { id: savedBlog.id },
            relations: ['author'],
        });
        if (!blogWithAuthor) {
            throw new Error('Failed to load blog with author');
        }
        await this.notificationQueue.enqueueBlogCreatedEvent({
            blogId: blogWithAuthor.id,
            title: blogWithAuthor.title,
            authorId: blogWithAuthor.authorId,
            createdAt: blogWithAuthor.createdAt,
        });
        return blogWithAuthor;
    }
    async findAll() {
        return this.blogRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }
    async update(id, updateBlogInput, user) {
        const blog = await this.findOne(id);
        if (blog.authorId !== user.id) {
            throw new common_1.UnauthorizedException('You can only update your own blogs');
        }
        Object.assign(blog, updateBlogInput);
        return this.blogRepository.save(blog);
    }
    async remove(id, user) {
        const blog = await this.findOne(id);
        if (blog.authorId !== user.id) {
            throw new common_1.UnauthorizedException('You can only delete your own blogs');
        }
        await this.blogRepository.remove(blog);
        return true;
    }
};
BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_queue_service_1.NotificationQueueService])
], BlogService);
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map