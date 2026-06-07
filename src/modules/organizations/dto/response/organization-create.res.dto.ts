import { ApiProperty } from '@nestjs/swagger';
import { OrganizationCreateResponse } from '@/modules/organizations/types';
import { OrganizationUserResponseDto } from './organization-user.res.dto';

export class OrganizationCreateResponseDto implements OrganizationCreateResponse {
  @ApiProperty({
    description: 'The id of the organization',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the organization',
    example: 'My Organization',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The description of the organization',
    example: 'My Organization Description',
    nullable: true,
    type: String,
  })
  description: string | null;

  @ApiProperty({
    description: 'The created at date of the organization',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the organization',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The user who created the organization',
    type: OrganizationUserResponseDto,
  })
  User_Organization_createdByUserIdToUser: OrganizationUserResponseDto;
}
