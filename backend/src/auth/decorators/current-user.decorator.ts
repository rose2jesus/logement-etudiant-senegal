import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Utilisation : async monEndpoint(@CurrentUser() user: JwtPayload) { ... }
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // injecté par JwtStrategy.validate()
  },
);
