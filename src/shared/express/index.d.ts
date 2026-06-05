import type { OrganizationUserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      request_id?: string;
    }
  }
}
