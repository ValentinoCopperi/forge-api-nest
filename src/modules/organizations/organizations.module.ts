import { Module } from '@nestjs/common';
import { OrganizationActionGuard } from './guards/organization.action.guard';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationActionGuard],
})
export class OrganizationsModule {}
