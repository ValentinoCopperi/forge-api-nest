import { Prisma } from 'generated/prisma/client';

/*
    Response type for the organization create operation
*/
export const organizationCreateSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  logoUrl: true,
  bannerUrl: true,
  User_Organization_createdByUserIdToUser: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.OrganizationSelect;

export type OrganizationCreateResponse = Prisma.OrganizationGetPayload<{
  select: typeof organizationCreateSelect;
}>;

/*
    Response type for the organizations get by id
*/

export const organizationFindOneSelect = {
  ...organizationCreateSelect,
  User_Organization_createdByUserIdToUser: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  Project: {
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      status: true,
      User_Project_managerIdToUser: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  },
  OrganizationUser: {
    select: {
      id: true,
      role: true,
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  },
} satisfies Prisma.OrganizationSelect;

export type OrganizationFindOneResponse = Prisma.OrganizationGetPayload<{
  select: typeof organizationFindOneSelect;
}>;

/*
    Response type for the organizations get all operation
*/
export const organizationsGetAllSelect = {
  ...organizationCreateSelect,
  _count: {
    select: {
      OrganizationUser: true,
      Project: true,
    },
  },
} satisfies Prisma.OrganizationSelect;

export type OrganizationsGetAll = Prisma.OrganizationGetPayload<{
  select: typeof organizationsGetAllSelect;
}>;

export type OrganizationsGetAllByUserId = OrganizationsGetAll & {
  role: Prisma.OrganizationUserGetPayload<{
    select: { role: true };
  }>['role'];
};