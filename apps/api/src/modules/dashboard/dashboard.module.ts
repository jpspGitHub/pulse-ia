import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { AggregatedMetricsRepository } from './dataaccess/aggregated-metrics.repository';
import { AlertsRepository } from './dataaccess/alerts.repository';
import { RecommendedActionsRepository } from './dataaccess/recommended-actions.repository';
import { TenantsRepository } from '../tenants/dataaccess/tenants.repository';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    AggregatedMetricsRepository,
    AlertsRepository,
    RecommendedActionsRepository,
    TenantsRepository,
    RolesGuard,
  ],
})
export class DashboardModule {}
