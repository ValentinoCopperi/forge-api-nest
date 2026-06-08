import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({type: 'number', example: 400 })
  statusCode: number;

  @ApiProperty({type: 'string', example: '2026-06-08T12:34:56.789Z' })
  timestamp: string;

  @ApiProperty({type: 'string', example: '/api/v1/auth/login' })
  path: string;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Invalid credentials' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be an email'],
      },
    ],
  })
  message: string | string[];
}