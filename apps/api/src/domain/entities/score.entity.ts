import { DimensionKey } from '../enums/dimension-key.enum';

export interface Score {
  id: string;
  tenant_id: string;
  session_id: string;
  message_id: string | null;
  dimension_key: DimensionKey;
  score: number;
  confidence: number;
  created_at: Date;
}
