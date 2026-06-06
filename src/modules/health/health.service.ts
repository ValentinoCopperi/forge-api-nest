import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { HealthCheckResponseDto } from '@/modules/health/dto';

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
