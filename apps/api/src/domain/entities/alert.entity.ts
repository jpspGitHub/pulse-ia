import { AlertSeverity } from '../enums/alert-severity.enum';
import { AlertStatus } from '../enums/alert-status.enum';
import { AlertType } from '../enums/alert-type.enum';

export interface Alert {
  id: string;
  tenant_id: string;
  period_start: string;
  segment_id: string | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  summary: string;
  details: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}
