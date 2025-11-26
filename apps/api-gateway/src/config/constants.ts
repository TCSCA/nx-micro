export const SERVICES = {
  SERVICE1: 'service1',
  SERVICE2: 'service2',
  CSV_SERVICE: 'CSV_SERVICE',
} as const;

export const COMMANDS = {
  HELLO: 'hello',
  HEALTH: 'health',
  ERROR: 'error',
} as const;

export const TCP_CONFIG = {
  HOST: process.env.SERVICE_HOST || '127.0.0.1',
  PORTS: {
    SERVICE1: parseInt(process.env.PORT_SERVICE1 || '3001'),
    SERVICE2: parseInt(process.env.PORT_SERVICE2 || '3002'),
    CSV_PROCESSOR: parseInt(process.env.PORT_CSV_PROCESSOR || '3003'),
  },
  TIMEOUT: parseInt(process.env.TCP_TIMEOUT || '5000'),
} as const;
