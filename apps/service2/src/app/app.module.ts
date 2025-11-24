import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObservabilityModule } from 'libs/observability/src';
import { PrismaClientModule } from 'libs/prisma-client/src';

@Module({
  imports: [
    ObservabilityModule.forRoot('service2'),
    PrismaClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
