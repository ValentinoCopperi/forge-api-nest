import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { AtLeastOneField } from '@/modules/organizations/validators/at-least-one-field.validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional({
    description: 'The name of the organization',
    example: 'My Organization',
    minLength: 3,
    maxLength: 255,
  })
  @AtLeastOneField(['name', 'description'])
  name?: string;
}
