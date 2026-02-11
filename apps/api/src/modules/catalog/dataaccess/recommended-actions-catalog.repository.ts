import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { RecommendedActionCategory } from '../../../domain/enums/recommended-action-category.enum';

export type RecommendedActionCatalogRecord = {
  id: string;
  key: string;
  category: RecommendedActionCategory;
  title_es: string;
  title_en: string;
  title_pt: string;
  description_es: string;
  description_en: string;
  description_pt: string;
  suggested_when: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class RecommendedActionsCatalogRepository {
  async listAll(): Promise<RecommendedActionCatalogRecord[]> {
    return DbClient.callProcedure<RecommendedActionCatalogRecord>(
      'api_list_recommended_actions_catalog',
    );
  }
}
