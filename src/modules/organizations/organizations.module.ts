import { Module } from '@nestjs/common';
import { StorageModule } from '@/shared';
import { OrganizationActionGuard } from './guards/organization.action.guard';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationActionGuard],
  imports: [StorageModule],
})
export class OrganizationsModule {}
