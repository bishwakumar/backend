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
exports.UserNotificationState = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../auth/entities/user.entity");
let UserNotificationState = class UserNotificationState {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], UserNotificationState.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User, {}),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserNotificationState.prototype, "user", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserNotificationState.prototype, "lastSeenMarkerVersion", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, {}),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserNotificationState.prototype, "updatedAt", void 0);
UserNotificationState = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('user_notification_state')
], UserNotificationState);
exports.UserNotificationState = UserNotificationState;
//# sourceMappingURL=user-notification-state.entity.js.map