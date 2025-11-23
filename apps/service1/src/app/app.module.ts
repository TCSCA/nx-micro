import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ObservabilityModule } from 'libs/observability/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RpcCustomExceptionFilter } from '../common/exceptions/rpc-custom-exception.filter';

@Module({
  imports: [
    ObservabilityModule.forRoot('service1'),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: RpcCustomExceptionFilter,
    },
  ],
})
export class AppModule { }
