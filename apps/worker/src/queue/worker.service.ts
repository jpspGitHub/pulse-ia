import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import { env } from '../env';
import { JOB_SCORE_MESSAGE, QUEUE_NAME } from './constants';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private worker?: Worker;
  private readonly logger = new Logger(WorkerService.name);

  onModuleInit() {
    this.worker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        if (job.name === JOB_SCORE_MESSAGE) {
          this.logger.log(`Scoring message: ${JSON.stringify(job.data)}`);
          return { scored: true };
        }

        this.logger.warn(`Unhandled job type: ${job.name}`);
        return { handled: false };
      },
      {
        connection: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job completed: ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Job failed: ${job?.id}`, error?.stack);
    });
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
