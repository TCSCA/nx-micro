/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { envs } from './app/config';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';


async function bootstrap() {
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

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.portService2);

  Logger.log(
    `🚀 Application is running on: http://localhost:${envs.portService2}/${globalPrefix}`
  );
}

bootstrap();
