import { DimensionKey } from '../enums/dimension-key.enum';
import { TenantStatus } from '../enums/tenant-status.enum';

export type CheckinSchedule = {
  cadence: string;
  days: string[];
  time: string;
  timezone: string;
};

export type TenantSettings = {
  anonymity_threshold: number;
  checkin_schedule: CheckinSchedule;
  enabled_dimensions: DimensionKey[];
  [key: string]: unknown;
};

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  settings: TenantSettings;
  created_at: Date;
  updated_at: Date;
}
