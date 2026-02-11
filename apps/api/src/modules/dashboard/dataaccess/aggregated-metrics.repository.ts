import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { PeriodType } from '../../../domain/enums/period-type.enum';
import { SegmentType } from '../../../domain/enums/segment-type.enum';

export type AggregatedMetricRecord = {
  id: string;
  tenant_id: string;
  period_type: PeriodType;
  period_start: string;
  period_end: string;
  segment_id: string | null;
  eligible_users_count: number;
  responding_users_count: number;
  metrics: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

export type AggregatedMetricWithSegmentRecord = AggregatedMetricRecord & {
  segment_type: SegmentType;
  segment_key: string;
  segment_display_name: string;
  segment_created_at: Date;
  segment_updated_at: Date;
};

@Injectable()
export class AggregatedMetricsRepository {
  async findGlobalByPeriod(
    tenantId: string,
    periodStart: string,
  ): Promise<AggregatedMetricRecord | null> {
    return DbClient.callProcedureSingle<AggregatedMetricRecord>(
      'api_get_aggregated_metric_global',
      [tenantId, periodStart],
    );
  }

  async listSegmentedByPeriod(
    tenantId: string,
    periodStart: string,
  ): Promise<AggregatedMetricWithSegmentRecord[]> {
    return DbClient.callProcedure<AggregatedMetricWithSegmentRecord>(
      'api_list_aggregated_metrics_segmented',
      [tenantId, periodStart],
    );
  }
}
