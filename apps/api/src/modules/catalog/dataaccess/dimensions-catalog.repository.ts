import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';

export type DimensionCatalogRecord = {
  key: string;
  display_name_es: string;
  display_name_en: string;
  display_name_pt: string;
  description: string | null;
};

@Injectable()
export class DimensionsCatalogRepository {
  async listAll(): Promise<DimensionCatalogRecord[]> {
    return DbClient.callProcedure<DimensionCatalogRecord>('api_list_dimensions_catalog');
  }
}
