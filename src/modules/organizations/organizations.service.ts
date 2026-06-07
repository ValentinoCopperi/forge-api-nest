import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddUserToOrganizationDto, CreateOrganizationDto } from '@/modules/organizations/dto';
import { resolveTargetUserId } from '@/modules/organizations/helpers/resolve-target-user.helper';
import { UserRequest } from '@/modules/auth/types';
import { OrganizationCreateResponse, organizationCreateSelect, OrganizationFindOneResponse, organizationFindOneSelect, OrganizationsGetAll, organizationsGetAllSelect } from '@/modules/organizations/types';
import { PrismaService } from '@/shared';
import { Prisma } from 'generated/prisma/client';
import { OrganizationUserRole } from 'generated/prisma/enums';

@Injectable()
export class OrganizationsService {

  constructor(private readonly prisma: PrismaService) { }

  create({ createOrganizationDto, user }: { createOrganizationDto: CreateOrganizationDto, user: UserRequest }): Promise<OrganizationCreateResponse> {


    return this.prisma.organization.create({
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
    })

  }

  findAll(): Promise<OrganizationsGetAll[]> {

    return this.prisma.organization.findMany({
      select: organizationsGetAllSelect,
    })

  }

  async findOne(id: number): Promise<OrganizationFindOneResponse> {

    const organization = await this.prisma.organization.findUnique({
      where: { id },
      select: organizationFindOneSelect,
    });

    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    
    return organization;
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

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
