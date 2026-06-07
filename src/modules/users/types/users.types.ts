import { Prisma } from 'generated/prisma/browser';

export const userDataSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;
