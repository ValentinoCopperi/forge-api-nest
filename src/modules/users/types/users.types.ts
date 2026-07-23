import { Prisma } from 'generated/prisma/browser';

export const userDataSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;





export const userGetAllSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  UserRole: {
    select: {
      role: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserGetAll = Prisma.UserGetPayload<{
  select: typeof userGetAllSelect;
}>;