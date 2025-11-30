"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const gqlContext = graphql_1.GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req;
    return request.user;
});
//# sourceMappingURL=current-user.decorator.js.map