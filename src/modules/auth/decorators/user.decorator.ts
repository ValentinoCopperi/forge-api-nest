import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { I_JwtPayload } from "@/modules/auth/types";


export const UserCurrent = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): I_JwtPayload | undefined => {
        const { user } = ctx.switchToHttp().getRequest<Express.Request>();
        return user;
    }
);
