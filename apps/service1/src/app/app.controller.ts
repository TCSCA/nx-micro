import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LOGGER_TOKEN } from '@nx-microservices/observability';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {
    this.logger.info('AppController initialized from service1');
  }

  @MessagePattern({ cmd: 'create_example' })
  createExample(@Payload() data: { name: string }) {
    this.logger.info(`CREATE_EXAMPLE message pattern called with name: ${data.name}`);
    return this.appService.createExample(data.name);
  }

}
