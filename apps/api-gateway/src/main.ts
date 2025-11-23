/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { envs } from './config/envs';
import { initObservability } from 'libs/observability/src/lib/observability';

async function bootstrap() {
  // Initialize observability with the correct service name
  initObservability('api-gateway');

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{
      path: '',
      method: RequestMethod.GET,
    }]
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Note: RpcCustomExceptionFilter is typically used for microservices
  // For HTTP API, you might want to use a regular ExceptionFilter instead
  // app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.portGateway);

  Logger.log(
    `🚀 Application is running on: http://localhost:${envs.portGateway}/${globalPrefix}`
  );
}

bootstrap();
