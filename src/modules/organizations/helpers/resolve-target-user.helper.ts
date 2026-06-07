import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
type UserIdentifier = {
  userId?: number;
  email?: string;
};

type PrismaUserDelegate = {
  findUnique(args: Prisma.UserFindUniqueArgs): Promise<{ id: number } | null>;
};

export async function resolveTargetUserId(
  prisma: PrismaUserDelegate,
  { userId, email }: UserIdentifier,
): Promise<number> {
  if (userId != null) {
    const user = await prisma.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user.id;
  }

  const user = await prisma.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  return user.id;
}
