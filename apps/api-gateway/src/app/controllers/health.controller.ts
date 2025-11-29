import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { LOGGER_TOKEN } from '@nx-microservices/observability';
import { Logger } from 'winston';

@ApiTags('Health')
@Controller()
export class HealthController {
    constructor(
        private readonly appService: AppService,
        @Inject(LOGGER_TOKEN) private readonly logger: Logger,
    ) {
        this.logger.info('Health Controller initialized');
    }

    @Get()
    @ApiOperation({ summary: 'Get API Gateway info', description: 'Returns a hello message from the API Gateway' })
    getHello(): string {
        this.logger.info('GET / endpoint called on API Gateway');
        return this.appService.getHello();
    }

}
