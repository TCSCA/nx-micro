import { APP_FILTER } from '@nestjs/core';
import { AppService } from '../app/app.service';
import { HttpExceptionFilter } from '../app/filters/http-exception.filter';
import { GatewayService } from '../app/services/gateway.service';

export const providersConfig = [
  AppService,
  GatewayService,
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];
