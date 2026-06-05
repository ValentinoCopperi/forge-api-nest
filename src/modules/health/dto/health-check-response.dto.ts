import { ApiProperty } from '@nestjs/swagger';

const HEALTH_CHECK_STATUS = ['ok', 'error'] as const;
type HealthCheckStatus = (typeof HEALTH_CHECK_STATUS)[number];

export class HealthCheckResponseDto {
  @ApiProperty({
    enum: HEALTH_CHECK_STATUS,
    description: 'Status of the health check',
    example: 'ok',
  })
  status: HealthCheckStatus;

  @ApiProperty({
    enum: HEALTH_CHECK_STATUS,
    description: 'Server status',
    example: 'ok',
  })
  server: HealthCheckStatus;

  @ApiProperty({
    enum: HEALTH_CHECK_STATUS,
    description: 'Database status',
    example: 'ok',
  })
  database: HealthCheckStatus;

  @ApiProperty({
    type: Date,
    description: 'Timestamp of the health check',
    example: new Date(),
  })
  timestamp: Date;
}
