import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GatewayController } from './controllers/gateway.controller';
import { HealthController } from './controllers/health.controller';
import { ObservabilityModule } from 'libs/observability/src';
import { microservicesConfig } from '../config/microservices.config';
import { providersConfig } from '../config/providers.config';

@Module({
  imports: [
    ObservabilityModule.forRoot('api-gateway'),
    microservicesConfig,
  ],
  controllers: [AppController, GatewayController, HealthController],
  providers: providersConfig,
})
export class AppModule { }
