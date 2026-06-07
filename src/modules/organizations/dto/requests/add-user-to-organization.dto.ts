import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { OrganizationUserRole } from 'generated/prisma/enums';
import { ExactlyOneUserIdentifier } from '@/modules/organizations/validators/exactly-one-user-identifier.validator';

export class AddUserToOrganizationDto {
  @ApiProperty({
    description: 'The id of the organization',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  organizationId: number;

  @ApiProperty({
    description: 'The id of the user to add',
    example: 1,
    required: false,
  })
  @ExactlyOneUserIdentifier()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId?: number;

  @ApiProperty({
    description: 'The email of the user to add',
    example: 'user@example.com',
    required: false,
    format: 'email',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;

  @ApiProperty({
    description: 'The role of the user in the organization',
    enum: OrganizationUserRole,
    example: OrganizationUserRole.MEMBER,
  })
  @IsEnum(OrganizationUserRole)
  role: OrganizationUserRole;
}
