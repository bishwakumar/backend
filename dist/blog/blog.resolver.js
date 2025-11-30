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
exports.BlogResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const blog_entity_1 = require("./entities/blog.entity");
const create_blog_input_1 = require("./dto/create-blog.input");
const update_blog_input_1 = require("./dto/update-blog.input");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BlogResolver = class BlogResolver {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async createBlog(createBlogInput, context) {
        return this.blogService.create(createBlogInput, context.req.user);
    }
    async blogs() {
        return this.blogService.findAll();
    }
    async blog(id) {
        return this.blogService.findOne(id);
    }
    async updateBlog(id, updateBlogInput, context) {
        return this.blogService.update(id, updateBlogInput, context.req.user);
    }
    async deleteBlog(id, context) {
        return this.blogService.remove(id, context.req.user);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => blog_entity_1.Blog),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_input_1.CreateBlogInput, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "createBlog", null);
__decorate([
    (0, graphql_1.Query)(() => [blog_entity_1.Blog]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "blogs", null);
__decorate([
    (0, graphql_1.Query)(() => blog_entity_1.Blog),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "blog", null);
__decorate([
    (0, graphql_1.Mutation)(() => blog_entity_1.Blog),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_input_1.UpdateBlogInput, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "updateBlog", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "deleteBlog", null);
BlogResolver = __decorate([
    (0, graphql_1.Resolver)(() => blog_entity_1.Blog),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogResolver);
exports.BlogResolver = BlogResolver;
//# sourceMappingURL=blog.resolver.js.map