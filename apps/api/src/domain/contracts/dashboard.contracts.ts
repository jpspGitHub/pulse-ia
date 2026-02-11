import { AggregatedMetric } from '../entities/aggregated-metric.entity';
import { Alert } from '../entities/alert.entity';
import { RecommendedActionCatalog } from '../entities/recommended-action-catalog.entity';
import { RecommendedActionInstance } from '../entities/recommended-action-instance.entity';
import { Segment } from '../entities/segment.entity';

export type DashboardPulseResponse = {
  period_start: string;
  metric: AggregatedMetric | null;
};

export type DashboardSegmentMetric = AggregatedMetric & {
  segment: Segment;
};

export type DashboardSegmentsResponse = {
  period_start: string;
  metrics: DashboardSegmentMetric[];
};

export type DashboardAlertsResponse = {
  status: string;
  alerts: Alert[];
};

export type DashboardRecommendedActionView = RecommendedActionInstance & {
  catalog: RecommendedActionCatalog;
};

export type DashboardRecommendedActionsResponse = {
  period_start: string;
  actions: DashboardRecommendedActionView[];
};
