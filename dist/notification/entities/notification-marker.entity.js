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
exports.NotificationMarker = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const blog_entity_1 = require("../../blog/entities/blog.entity");
let NotificationMarker = class NotificationMarker {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], NotificationMarker.prototype, "markerVersion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationMarker.prototype, "blogId", void 0);
__decorate([
    (0, graphql_1.Field)(() => blog_entity_1.Blog, {}),
    (0, typeorm_1.ManyToOne)(() => blog_entity_1.Blog, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'blogId' }),
    __metadata("design:type", blog_entity_1.Blog)
], NotificationMarker.prototype, "blog", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, {}),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NotificationMarker.prototype, "createdAt", void 0);
NotificationMarker = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('notification_markers')
], NotificationMarker);
exports.NotificationMarker = NotificationMarker;
//# sourceMappingURL=notification-marker.entity.js.map