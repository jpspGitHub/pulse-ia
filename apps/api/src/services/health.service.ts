import { Injectable } from '@nestjs/common';
import { checkDbConnectivity } from '../dataaccess/db';

@Injectable()
export class HealthService {
  async getHealth() {
    const dbStatus = await checkDbConnectivity();
    return {
      status: 'ok',
      db: dbStatus.ok ? 'ok' : 'error',
    };
  }
}
