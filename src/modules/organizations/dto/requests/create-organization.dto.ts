import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'My Organization',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'The description of the organization',
    example: 'My Organization Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  description?: string;
}
