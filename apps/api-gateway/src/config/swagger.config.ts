import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Microservices API Gateway')
    .setDescription('API Gateway for Microservices Architecture')
    .setVersion('1.0')
    .addTag('Gateway', 'General gateway operations')
    .addTag('CSV', 'CSV processing operations')
    .addTag('Health', 'Health check operations')
    .build();
