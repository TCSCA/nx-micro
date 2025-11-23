import { SetMetadata } from '@nestjs/common';

export const SERVICE_RESPONSE_KEY = 'serviceResponse';

export const ServiceResponse = (serviceName: string) =>
    SetMetadata(SERVICE_RESPONSE_KEY, serviceName);
