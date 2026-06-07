import { Reflector } from "@nestjs/core";
import { RoleActions } from "../constants/organizations-roles.constant";





export const RequireOrgAction = Reflector.createDecorator<RoleActions>();