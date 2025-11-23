import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObservabilityModule } from 'libs/observability/src';

@Module({
  imports: [
    ObservabilityModule.forRoot('service2'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
