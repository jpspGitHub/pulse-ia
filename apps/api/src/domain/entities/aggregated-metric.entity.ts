import { PeriodType } from '../enums/period-type.enum';

export interface AggregatedMetric {
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
}
