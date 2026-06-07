import { $Enums } from 'generated/prisma/client';

export interface I_JwtPayload {
  sub: number;
  email: string;
  avatarUrl: string | null;
  roles: $Enums.Role[];
}

export type UserRequest = I_JwtPayload;
