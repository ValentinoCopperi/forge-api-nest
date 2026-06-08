import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddUserToOrganizationDto,
  CreateOrganizationDto,
  RemoveUserFromOrganizationDto,
  UpdateOrganizationDto,
  UpdateUserOrganizationRoleDto,
} from '@/modules/organizations/dto';
import { resolveTargetUserId } from '@/modules/organizations/helpers/resolve-target-user.helper';
import { UserRequest } from '@/modules/auth/types';
import {
  OrganizationCreateResponse,
  organizationCreateSelect,
  OrganizationFindOneResponse,
  organizationFindOneSelect,
  OrganizationsGetAll,
  organizationsGetAllSelect,
} from '@/modules/organizations/types';
import { PrismaService, StorageService } from '@/shared';
import { Prisma } from 'generated/prisma/client';
import { OrganizationUserRole } from 'generated/prisma/enums';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create({
    createOrganizationDto,
    user,
  }: {
    createOrganizationDto: CreateOrganizationDto;
    user: UserRequest;
  }): Promise<OrganizationCreateResponse> {
    const organization = await this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
        createdByUserId: user.sub,
        OrganizationUser: {
          create: {
            userId: user.sub,
            role: OrganizationUserRole.OWNER,
          },
        },
      },
      select: organizationCreateSelect,
    });

    return this.storageService.signAvatarUrls(organization);
  }

  async findAll(): Promise<OrganizationsGetAll[]> {
    const organizations = await this.prisma.organization.findMany({
      select: organizationsGetAllSelect,
    });

    return this.storageService.signAvatarUrls(organizations);
  }

  async findOne(id: number): Promise<OrganizationFindOneResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      select: organizationFindOneSelect,
    });

    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }

    return this.storageService.signAvatarUrls(organization);
  }

  async addUserToOrganization(
    addUserToOrganizationDto: AddUserToOrganizationDto,
  ): Promise<void> {
    const { organizationId, role } = addUserToOrganizationDto;
    const targetUserId = await resolveTargetUserId(
      this.prisma.user,
      addUserToOrganizationDto,
    );

    try {
      await this.prisma.organizationUser.create({
        data: {
          organizationId,
          userId: targetUserId,
          role,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `User with id ${targetUserId} already exists in organization with id ${organizationId}`,
        );
      }

      throw error;
    }
  }

  async removeUserFromOrganization(
    removeUserFromOrganizationDto: RemoveUserFromOrganizationDto,
  ): Promise<void> {
    const { organizationId } = removeUserFromOrganizationDto;
    const targetUserId = await resolveTargetUserId(
      this.prisma.user,
      removeUserFromOrganizationDto,
    );

    try {
      await this.prisma.organizationUser.delete({
        where: {
          organizationId_userId: {
            organizationId,
            userId: targetUserId,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `User with id ${targetUserId} not found in organization with id ${organizationId}`,
        );
      }

      throw error;
    }
  }

  async updateUserOrganizationRole(
    updateUserOrganizationRoleDto: UpdateUserOrganizationRoleDto,
  ): Promise<void> {
    const { organizationId, role } = updateUserOrganizationRoleDto;
    const targetUserId = await resolveTargetUserId(
      this.prisma.user,
      updateUserOrganizationRoleDto,
    );

    try {
      await this.prisma.organizationUser.update({
        where: {
          organizationId_userId: {
            organizationId,
            userId: targetUserId,
          },
        },
        data: {
          role,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `User with id ${targetUserId} not found in organization with id ${organizationId}`,
        );
      }

      throw error;
    }
  }

  async update({
    id,
    updateOrganizationDto,
    user,
  }: {
    id: number;
    updateOrganizationDto: UpdateOrganizationDto;
    user: UserRequest;
  }): Promise<OrganizationCreateResponse> {
    try {
      const organization = await this.prisma.organization.update({
        where: { id },
        data: {
          ...updateOrganizationDto,
          updatedByUserId: user.sub,
          updatedAt: new Date(),
        },
        select: organizationCreateSelect,
      });

      return this.storageService.signAvatarUrls(organization);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Organization with id ${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.organization.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Organization with id ${id} not found`);
      }

      throw error;
    }
  }
}
