import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCP_CONFIG, SERVICES } from './constants';

export const microservicesConfig = ClientsModule.register([
  {
    name: SERVICES.SERVICE1,
    transport: Transport.TCP,
    options: {
      host: TCP_CONFIG.HOST,
      port: TCP_CONFIG.PORTS.SERVICE1,
    },
  },
  {
    name: SERVICES.SERVICE2,
    transport: Transport.TCP,
    options: {
      host: TCP_CONFIG.HOST,
      port: TCP_CONFIG.PORTS.SERVICE2,
    },
  },
]);
