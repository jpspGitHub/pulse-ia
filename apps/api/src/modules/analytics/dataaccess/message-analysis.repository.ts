import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { AnalysisIntent } from '../../../domain/enums/analysis-intent.enum';
import { AnalysisSentiment } from '../../../domain/enums/analysis-sentiment.enum';
import { AnalysisUrgency } from '../../../domain/enums/analysis-urgency.enum';

export type MessageAnalysisRecord = {
  id: string;
  tenant_id: string;
  message_id: string;
  intent: AnalysisIntent;
  sentiment: AnalysisSentiment;
  urgency: AnalysisUrgency;
  topics: string[];
  dimensions: Record<string, number>;
  confidence: number;
  raw: Record<string, unknown>;
  created_at: Date;
};

@Injectable()
export class MessageAnalysisRepository {
  async findByMessageId(
    tenantId: string,
    messageId: string,
  ): Promise<MessageAnalysisRecord | null> {
    return DbClient.callProcedureSingle<MessageAnalysisRecord>('api_get_message_analysis', [
      tenantId,
      messageId,
    ]);
  }
}
