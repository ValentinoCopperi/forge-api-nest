import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from '@/modules/auth/decorators';
import { HealthCheckResponseDto } from '@/modules/health/dto';
import { HealthService } from './health.service';
import { ApiCommonErrors } from '@/shared/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@ApiCommonErrors()
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get('/health')
  @ApiResponse({
    status: 200,
    description: 'Health check response',
    type: HealthCheckResponseDto,
  })
  async getHealth(): Promise<HealthCheckResponseDto> {
    return this.healthService.getHealthCheck();
  }
}
