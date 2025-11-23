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
    this.logger.info('AppController initialized');
  }

  @Get()
  getHello(): string {
    this.logger.info('GET / endpoint called');
    return this.appService.getHello();
  }

  @Get('error')
  getError() {
    this.logger.warn('GET /error endpoint called - this will trigger an error');
    return this.appService.exampleError();
  }
}
