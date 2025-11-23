import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { LOGGER_TOKEN } from 'libs/observability/src';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {
    this.logger.info('API Gateway Controller initialized');
  }

  @Get()
  getHello(): string {
    this.logger.info('GET / endpoint called on API Gateway');
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    this.logger.info('GET /health endpoint called on API Gateway');
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
