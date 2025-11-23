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
    this.logger.info('Service2 Controller initialized');
  }

  @Get()
  getData() {
    this.logger.info('GET / endpoint called on Service2');
    return this.appService.getData();
  }

  @Get('health')
  getHealth() {
    this.logger.info('GET /health endpoint called on Service2');
    return {
      status: 'ok',
      service: 'service2',
      timestamp: new Date().toISOString(),
    };
  }
}
