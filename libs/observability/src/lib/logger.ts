import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

// Create and configure the logger
export function createLogger(serviceName: string) {
  const logger = winston.createLogger({
    level: process.env['LOG_LEVEL'] || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      // Console transport for local development
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      // OpenTelemetry transport for sending logs to OpenTelemetry collector
      new OpenTelemetryTransportV3(),
    ],
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason instanceof Error ? reason : new Error(String(reason)));
  });

  return logger;
}

// Default logger instance
export const logger = createLogger(process.env['OTEL_SERVICE_NAME'] || 'unknown-service');
