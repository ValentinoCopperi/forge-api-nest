import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { HealthCheckResponseDto } from './dto/health-check-response.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getHealthCheck(): Promise<HealthCheckResponseDto> {
    const [prismaResult] = await Promise.allSettled([
      this.prisma.$queryRaw`SELECT 1`,
    ]);

    const databaseOk = prismaResult.status === 'fulfilled';

    return {
      status: 'ok',
      server: 'ok',
      database: databaseOk ? 'ok' : 'error',
      timestamp: new Date(),
    };
  }
}
