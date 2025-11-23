import { ClientsModule, Transport } from '@nestjs/microservices';

export const microservicesConfig = ClientsModule.register([
    {
        name: 'SERVICE1',
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 3001,
        },
    },
    {
        name: 'SERVICE2',
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 3002,
        },
    },
]);
