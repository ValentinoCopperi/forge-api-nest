import type { I_JwtPayload } from '@/modules/auth/types';

declare global {
  namespace Express {
    interface Request {
      request_id?: string;
      user?: I_JwtPayload;
    }
  }
}
