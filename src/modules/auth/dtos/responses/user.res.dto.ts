import { I_JwtPayload } from '@/modules';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'The user id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The user name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The user email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The user avatar url',
    example: 'https://example.com/avatar.png',
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: 'The user roles',
    example: ['DIRECTOR', 'GERENTE', 'EMPLEADO'],
    enum: $Enums.Role,
  })
  roles: $Enums.Role[];
}
