"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_service_1 = require("./notification.service");
const notification_resolver_1 = require("./notification.resolver");
const notification_marker_entity_1 = require("./entities/notification-marker.entity");
const user_notification_state_entity_1 = require("./entities/user-notification-state.entity");
const notification_queue_service_1 = require("./queue/notification-queue.service");
const notification_worker_service_1 = require("./worker/notification-worker.service");
const blog_module_1 = require("../blog/blog.module");
const user_entity_1 = require("../auth/entities/user.entity");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_marker_entity_1.NotificationMarker, user_notification_state_entity_1.UserNotificationState, user_entity_1.User]),
            blog_module_1.BlogModule,
        ],
        providers: [
            notification_service_1.NotificationService,
            notification_resolver_1.NotificationResolver,
            notification_queue_service_1.NotificationQueueService,
            notification_worker_service_1.NotificationWorkerService,
        ],
        exports: [notification_service_1.NotificationService, notification_queue_service_1.NotificationQueueService],
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map