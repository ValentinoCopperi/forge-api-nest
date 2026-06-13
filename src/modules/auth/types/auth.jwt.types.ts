import { $Enums } from 'generated/prisma/client';

export interface I_JwtPayload {
  sub: number;
  email: string;
  avatarUrl: string | null;
  roles: $Enums.Role[];
  jti?: string;
}

export type UserRequest = I_JwtPayload;
