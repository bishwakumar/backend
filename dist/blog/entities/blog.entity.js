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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../auth/entities/user.entity");
let Blog = class Blog {
    static _GRAPHQL_METADATA_FACTORY() {
        return { authorId: { type: () => String } };
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Blog.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {}),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {}),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, {}),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Blog.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, {}),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Blog.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User, {}),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.blogs),
    (0, typeorm_1.JoinColumn)({ name: 'authorId' }),
    __metadata("design:type", user_entity_1.User)
], Blog.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "authorId", void 0);
Blog = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('blogs')
], Blog);
exports.Blog = Blog;
//# sourceMappingURL=blog.entity.js.map