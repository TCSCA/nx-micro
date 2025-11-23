import { DynamicModule, Global, Module } from '@nestjs/common';
import { logger } from './logger';

export const LOGGER_TOKEN = 'LOGGER';

@Global()
@Module({})
export class ObservabilityModule {
  static forRoot(serviceName: string): DynamicModule {
    // Initialize the logger with the service name
    const loggerInstance = logger.child({ service: serviceName });

    return {
      module: ObservabilityModule,
      providers: [
        {
          provide: LOGGER_TOKEN,
          useValue: loggerInstance,
        },
      ],
      exports: [LOGGER_TOKEN],
    };
  }
}
