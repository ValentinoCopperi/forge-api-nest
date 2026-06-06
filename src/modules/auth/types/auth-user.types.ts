import { Prisma } from 'generated/prisma/client';

export const userWithRoleSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  UserRole: {
    select: { role: true },
  },
} satisfies Prisma.UserSelect;

export type UserWithRole = Prisma.UserGetPayload<{
  select: typeof userWithRoleSelect;
}>;
