import { AnalysisIntent } from '../enums/analysis-intent.enum';
import { AnalysisSentiment } from '../enums/analysis-sentiment.enum';
import { AnalysisUrgency } from '../enums/analysis-urgency.enum';
import { DimensionKey } from '../enums/dimension-key.enum';

export type DimensionScores = Record<DimensionKey, number>;

export interface MessageAnalysis {
  id: string;
  tenant_id: string;
  message_id: string;
  intent: AnalysisIntent;
  sentiment: AnalysisSentiment;
  urgency: AnalysisUrgency;
  topics: string[];
  dimensions: DimensionScores;
  confidence: number;
  raw: Record<string, unknown>;
  created_at: Date;
}
