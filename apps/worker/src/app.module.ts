import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { WorkerService } from './queue/worker.service';

@Module({
  controllers: [HealthController],
  providers: [WorkerService],
})
export class AppModule {}
