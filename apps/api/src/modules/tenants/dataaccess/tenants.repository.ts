import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { TenantSettings } from '../../../domain/entities/tenant.entity';
import { TenantStatus } from '../../../domain/enums/tenant-status.enum';

export type TenantRecord = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  settings: TenantSettings;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class TenantsRepository {
  async findById(id: string): Promise<TenantRecord | null> {
    return DbClient.callProcedureSingle<TenantRecord>('api_get_tenant', [id]);
  }

  async updateSettings(id: string, settings: TenantSettings): Promise<TenantRecord | null> {
    return DbClient.callProcedureSingle<TenantRecord>('api_update_tenant_settings', [id, settings]);
  }
}
