import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { RecommendedActionCategory } from '../../../domain/enums/recommended-action-category.enum';
import { RecommendedActionStatus } from '../../../domain/enums/recommended-action-status.enum';

export type RecommendedActionInstanceRecord = {
  id: string;
  tenant_id: string;
  period_start: string;
  segment_id: string | null;
  catalog_action_id: string;
  status: RecommendedActionStatus;
  rationale: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  catalog_key: string;
  catalog_category: RecommendedActionCategory;
  title_es: string;
  title_en: string;
  title_pt: string;
  description_es: string;
  description_en: string;
  description_pt: string;
  suggested_when: Record<string, unknown>;
};

@Injectable()
export class RecommendedActionsRepository {
  async listByPeriod(
    tenantId: string,
    periodStart: string,
  ): Promise<RecommendedActionInstanceRecord[]> {
    return DbClient.callProcedure<RecommendedActionInstanceRecord>(
      'api_list_recommended_actions_by_period',
      [tenantId, periodStart],
    );
  }
}
