import { ApiProperty } from '@nestjs/swagger';
import { createArrayResponseDto } from '@/shared/dto';
import { OrganizationsGetAll } from '@/modules/organizations/types';
import { OrganizationCreateResponseDto } from './organization-create.res.dto';

class OrganizationCountResponseDto {
  @ApiProperty({
    description: 'Number of users in the organization',
    example: 5,
    type: Number,
  })
  OrganizationUser: number;

  @ApiProperty({
    description: 'Number of projects in the organization',
    example: 3,
    type: Number,
  })
  Project: number;
}

export class OrganizationsGetAllResponseDto
  extends OrganizationCreateResponseDto
  implements OrganizationsGetAll
{
  @ApiProperty({
    description: 'Related entity counts',
    type: OrganizationCountResponseDto,
  })
  _count: OrganizationCountResponseDto;
}

export const OrganizationsGetAllListResponseDto = createArrayResponseDto(
  OrganizationsGetAllResponseDto,
  'OrganizationsGetAllListResponseDto',
);
