import { HttpResponse } from 'mvc-common-toolkit';
import { appConfig } from 'src/configs/app.config';

import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  check(): HttpResponse {
    return {
      success: true,
      data: {
        status: 'ok',
        service: this.app.serviceName,
        env: this.app.nodeEnv,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
