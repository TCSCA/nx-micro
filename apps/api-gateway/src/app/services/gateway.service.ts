import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LOGGER_TOKEN } from 'libs/observability/src';
import { Logger } from 'winston';
import { timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

interface ServiceHealth {
  status: string;
  service: string;
  timestamp?: string;
  error?: string;
}

@Injectable()
export class GatewayService {
  constructor(
    @Inject('SERVICE1') private readonly service1Client: ClientProxy,
    @Inject('SERVICE2') private readonly service2Client: ClientProxy,
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {
    this.logger.info('Gateway Service initialized with TCP clients');
  }
  // saas
  private getClient(serviceName: string): ClientProxy {
    switch (serviceName) {
      case 'service1':
        return this.service1Client;
      case 'service2':
        return this.service2Client;
      default:
        throw new Error(`Service ${serviceName} not found`);
    }
  }

  async sendCommand(serviceName: string, pattern: string, data?: any): Promise<any> {
    const client = this.getClient(serviceName);
    const command = { cmd: pattern };
    const payload = data ?? {};

    this.logger.info(`Sending TCP command to ${serviceName}: ${pattern}`, { command, payload });

    try {
      // Ensure client is connected
      await client.connect();

      const response = await firstValueFrom(
        client.send(command, payload).pipe(timeout(5000))
      );

      this.logger.info(`TCP response from ${serviceName}`, {
        pattern,
        response,
      });

      return response;
    } catch (error) {
      this.logger.error(`Error sending TCP command to ${serviceName}`, {
        pattern,
        command,
        error: error.message,
        errorDetails: error,
      });
      throw error;
    }
  }

  async getServiceHealth(serviceName: string): Promise<ServiceHealth> {
    return this.sendCommand(serviceName, 'health');
  }

  async getAllServicesHealth(): Promise<{ gateway: ServiceHealth; services: ServiceHealth[] }> {
    const healthChecks = await Promise.allSettled(
      ['service1', 'service2'].map(async (name) => {
        try {
          const health = await this.getServiceHealth(name);
          return { service: name, status: 'healthy', ...health };
        } catch (error) {
          return { service: name, status: 'unhealthy', error: (error as Error).message };
        }
      })
    );

    return {
      gateway: {
        service: 'api-gateway',
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      services: healthChecks.map(result =>
        result.status === 'fulfilled' ? result.value : result.reason
      ),
    };
  }

  async callServiceHello(serviceName: string): Promise<any> {
    return this.sendCommand(serviceName, 'hello');
  }

  async callServiceError(serviceName: string): Promise<any> {
    return this.sendCommand(serviceName, 'error');
  }
}
