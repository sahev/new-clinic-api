import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'Ping database check' })
  @ApiResponse({
    status: 200
  })
  @Public()
  @Get()
  @HealthCheck()
  async check() {
    let startTime = Date.now();

    const pingResponse = await this.health.check([
      () => this.db.pingCheck('database', { timeout: 10000 }),
    ]);

    let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(3);

    return {
      ping: elapsedTime,
      ...pingResponse
    }
  }
}