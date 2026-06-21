import { ApiProperty } from '@nestjs/swagger';
import { createArrayResponseDto } from '@/shared/dto';
import { OrganizationsGetAllByUserId } from '../../types';

export class OrganizationOfUserDto implements OrganizationsGetAllByUserId {
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
    description: 'The logo url of the organization',
    example: 'https://example.com/logo.png',
    type: String,
    nullable: true,
  })
  logoUrl: string | null;
}

export const OrganizationOfUserResponseDto = createArrayResponseDto(
  OrganizationOfUserDto,
  'OrganizationOfUserResponseDto',
);
