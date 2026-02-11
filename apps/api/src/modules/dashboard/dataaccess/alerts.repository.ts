import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { AlertSeverity } from '../../../domain/enums/alert-severity.enum';
import { AlertStatus } from '../../../domain/enums/alert-status.enum';
import { AlertType } from '../../../domain/enums/alert-type.enum';

export type AlertRecord = {
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
};

@Injectable()
export class AlertsRepository {
  async listByStatus(tenantId: string, status: AlertStatus): Promise<AlertRecord[]> {
    return DbClient.callProcedure<AlertRecord>('api_list_alerts_by_status', [tenantId, status]);
  }
}
