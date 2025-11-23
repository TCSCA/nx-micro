import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN } from 'libs/observability/src';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {
    this.logger.info('Service2 Service initialized');
  }

  getData(): { message: string } {
    this.logger.info('Service2 says hello!');
    return { message: 'Hello from Service2' };
  }

  getHealth(): object {
    this.logger.info('Service2 health check');
    return {
      status: 'ok',
      service: 'service2',
      timestamp: new Date().toISOString(),
    };
  }
}
