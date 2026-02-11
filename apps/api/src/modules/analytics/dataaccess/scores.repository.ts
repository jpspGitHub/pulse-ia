import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { DimensionKey } from '../../../domain/enums/dimension-key.enum';

export type ScoreRecord = {
  id: string;
  tenant_id: string;
  session_id: string;
  message_id: string | null;
  dimension_key: DimensionKey;
  score: number;
  confidence: number;
  created_at: Date;
};

@Injectable()
export class ScoresRepository {
  async listBySession(tenantId: string, sessionId: string): Promise<ScoreRecord[]> {
    return DbClient.callProcedure<ScoreRecord>('api_list_scores_by_session', [tenantId, sessionId]);
  }
}
