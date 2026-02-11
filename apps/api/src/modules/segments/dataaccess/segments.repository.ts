import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { SegmentType } from '../../../domain/enums/segment-type.enum';

export type SegmentRecord = {
  id: string;
  tenant_id: string;
  type: SegmentType;
  key: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class SegmentsRepository {
  async listByTenant(tenantId: string): Promise<SegmentRecord[]> {
    return DbClient.callProcedure<SegmentRecord>('api_list_segments', [tenantId]);
  }

  async findById(tenantId: string, id: string): Promise<SegmentRecord | null> {
    return DbClient.callProcedureSingle<SegmentRecord>('api_get_segment', [tenantId, id]);
  }

  async create(tenantId: string, input: { type: SegmentType; key: string; display_name: string }) {
    return DbClient.callProcedureSingle<SegmentRecord>('api_create_segment', [
      tenantId,
      input.type,
      input.key,
      input.display_name,
    ]);
  }
}
