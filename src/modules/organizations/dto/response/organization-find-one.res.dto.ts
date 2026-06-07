import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma/client';
import { OrganizationFindOneResponse } from '@/modules/organizations/types';
import { OrganizationCreateResponseDto } from './organization-create.res.dto';
import { OrganizationUserResponseDto } from './organization-user.res.dto';

class OrganizationProjectResponseDto {
  @ApiProperty({
    description: 'The id of the project',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the project',
    example: 'My Project',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Project description',
    nullable: true,
    type: String,
  })
  description: string | null;

  @ApiProperty({
    description: 'The created at date of the project',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The status of the project',
    enum: $Enums.ProjectStatus,
    example: $Enums.ProjectStatus.ACTIVE,
  })
  status: $Enums.ProjectStatus;

  @ApiProperty({
    description: 'The manager of the project',
    type: OrganizationUserResponseDto,
  })
  User_Project_managerIdToUser: OrganizationUserResponseDto;
}

class OrganizationMemberResponseDto {
  @ApiProperty({
    description: 'The id of the organization membership',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The role of the user in the organization',
    enum: $Enums.OrganizationUserRole,
    example: $Enums.OrganizationUserRole.MEMBER,
  })
  role: $Enums.OrganizationUserRole;

  @ApiProperty({
    description: 'The user in the organization',
    type: OrganizationUserResponseDto,
  })
  User: OrganizationUserResponseDto;
}

export class OrganizationFindOneResponseDto
  extends OrganizationCreateResponseDto
  implements OrganizationFindOneResponse
{
  @ApiProperty({
    description: 'Projects in the organization',
    type: OrganizationProjectResponseDto,
    isArray: true,
  })
  Project: OrganizationProjectResponseDto[];

  @ApiProperty({
    description: 'Users in the organization',
    type: OrganizationMemberResponseDto,
    isArray: true,
  })
  OrganizationUser: OrganizationMemberResponseDto[];
}
