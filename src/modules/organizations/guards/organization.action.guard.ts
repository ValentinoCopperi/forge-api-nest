import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequireOrgAction } from '@/modules/organizations/decorators/action.decorator';
import { organizationRoleAllowsAction } from '@/modules/organizations/helpers/organization.permissions';
import { PrismaService } from '@/shared';

@Injectable()
export class OrganizationActionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const action = this.reflector.get(RequireOrgAction, context.getHandler());

        if (!action) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException();
        }

        const organizationId = this.resolveOrganizationId(request);

        if (!organizationId || Number.isNaN(organizationId)) {
            throw new BadRequestException('Invalid or missing organization id');
        }

        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });

        if (!organization) {
            throw new NotFoundException(`Organization with id ${organizationId} not found`);
        }

        const organizationUser = await this.prisma.organizationUser.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId: user.sub,
                },
            },
        });

        if (!organizationUser) {
            throw new ForbiddenException('User is not a member of the organization');
        }

        if (!organizationRoleAllowsAction(organizationUser.role, action)) {
            throw new ForbiddenException('Role does not allow this action');
        }

        return true;
    }

    private resolveOrganizationId(request: {
        body?: { organizationId?: number };
        params?: { id?: string; organizationId?: string };
    }): number {
        const fromBody = request.body?.organizationId;
        const fromParams = request.params?.organizationId ?? request.params?.id;

        return fromBody ?? Number(fromParams);
    }
}
