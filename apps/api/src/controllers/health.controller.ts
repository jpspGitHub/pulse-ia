import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  async health() {
    return this.healthService.getHealth();
  }
}
