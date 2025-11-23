import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN } from 'libs/observability/src';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {
    this.logger.info('AppService initialized');
  }

  getHello(): string {
    this.logger.info('Hello endpoint called');
    return 'Hello World!';
  }

  getHealth(): object {
    this.logger.info('Health check endpoint called');
    return {
      status: 'ok',
      service: 'service1',
      timestamp: new Date().toISOString(),
    };
  }

  exampleError(): void {
    try {
      // Simulate an error
      throw new Error('This is a test error');
    } catch (error) {
      this.logger.error('An error occurred in exampleError', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
