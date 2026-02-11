import { RecommendedActionCategory } from '../enums/recommended-action-category.enum';

export interface RecommendedActionCatalog {
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
}
