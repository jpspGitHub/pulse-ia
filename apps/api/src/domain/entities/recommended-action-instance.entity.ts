import { RecommendedActionStatus } from '../enums/recommended-action-status.enum';

export interface RecommendedActionInstance {
  id: string;
  tenant_id: string;
  period_start: string;
  segment_id: string | null;
  catalog_action_id: string;
  status: RecommendedActionStatus;
  rationale: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}
