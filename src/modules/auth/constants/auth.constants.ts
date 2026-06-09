import { Role } from 'generated/prisma/enums';

export const BCRYPT_ROUNDS = 10;
export const DEFAULT_ROLE = Role.EMPLEADO;
export const REFRESH_TOKEN_COOKIE_PATH = '/api/v1/auth';
