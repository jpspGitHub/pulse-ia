import { Injectable } from '@nestjs/common';
import { Errors } from '../../../common/errors/errors';
import { AggregatedMetricsRepository } from '../dataaccess/aggregated-metrics.repository';
import { AlertsRepository } from '../dataaccess/alerts.repository';
import { RecommendedActionsRepository } from '../dataaccess/recommended-actions.repository';
import { TenantsRepository } from '../../tenants/dataaccess/tenants.repository';
import { AlertStatus } from '../../../domain/enums/alert-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    private readonly aggregatedMetricsRepository: AggregatedMetricsRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly recommendedActionsRepository: RecommendedActionsRepository,
    private readonly tenantsRepository: TenantsRepository,
  ) {}

  async getPulse(tenantId: string, periodStart: string) {
    const metric = await this.aggregatedMetricsRepository.findGlobalByPeriod(tenantId, periodStart);
    return { period_start: periodStart, metric };
  }

  async getSegmentedMetrics(tenantId: string, periodStart: string) {
    const tenant = await this.tenantsRepository.findById(tenantId);
    if (!tenant) {
      throw Errors.notFound('Tenant not found');
    }

    const threshold =
      typeof tenant.settings?.anonymity_threshold === 'number'
        ? tenant.settings.anonymity_threshold
        : 5;

    const metrics = await this.aggregatedMetricsRepository.listSegmentedByPeriod(
      tenantId,
      periodStart,
    );

    const filtered = metrics.filter(
      (metric) => metric.segment_id === null || metric.eligible_users_count >= threshold,
    );

    return {
      period_start: periodStart,
      metrics: filtered.map((metric) => ({
        id: metric.id,
        tenant_id: metric.tenant_id,
        period_type: metric.period_type,
        period_start: metric.period_start,
        period_end: metric.period_end,
        segment_id: metric.segment_id,
        eligible_users_count: metric.eligible_users_count,
        responding_users_count: metric.responding_users_count,
        metrics: metric.metrics,
        created_at: metric.created_at,
        updated_at: metric.updated_at,
        segment: {
          id: metric.segment_id as string,
          tenant_id: metric.tenant_id,
          type: metric.segment_type,
          key: metric.segment_key,
          display_name: metric.segment_display_name,
          created_at: metric.segment_created_at,
          updated_at: metric.segment_updated_at,
        },
      })),
    };
  }

  async getAlerts(tenantId: string, status: AlertStatus) {
    const alerts = await this.alertsRepository.listByStatus(tenantId, status);
    return { status, alerts };
  }

  async getRecommendedActions(tenantId: string, periodStart: string) {
    const actions = await this.recommendedActionsRepository.listByPeriod(tenantId, periodStart);
    return {
      period_start: periodStart,
      actions: actions.map((action) => ({
        id: action.id,
        tenant_id: action.tenant_id,
        period_start: action.period_start,
        segment_id: action.segment_id,
        catalog_action_id: action.catalog_action_id,
        status: action.status,
        rationale: action.rationale,
        created_at: action.created_at,
        updated_at: action.updated_at,
        catalog: {
          id: action.catalog_action_id,
          key: action.catalog_key,
          category: action.catalog_category,
          title_es: action.title_es,
          title_en: action.title_en,
          title_pt: action.title_pt,
          description_es: action.description_es,
          description_en: action.description_en,
          description_pt: action.description_pt,
          suggested_when: action.suggested_when,
        },
      })),
    };
  }
}
