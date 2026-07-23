import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma/client';
import { createArrayResponseDto } from '@/shared/dto';
import { OrganizationsGetAllByUserId } from '@/modules/organizations/types';
import { OrganizationsGetAllResponseDto } from './organization-get-all.res.dto';

export class OrganizationsGetAllByUserResponseDto
  extends OrganizationsGetAllResponseDto
  implements OrganizationsGetAllByUserId
{
  @ApiProperty({
    description: 'The role of the current user in the organization',
    enum: $Enums.OrganizationUserRole,
    example: $Enums.OrganizationUserRole.MEMBER,
  })
  role: $Enums.OrganizationUserRole;
}

export const OrganizationsGetAllByUserListResponseDto = createArrayResponseDto(
  OrganizationsGetAllByUserResponseDto,
  'OrganizationsGetAllByUserListResponseDto',
);
