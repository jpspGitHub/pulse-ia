import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';

export type TenantDomainRecord = {
  id: string;
  tenant_id: string;
  domain: string;
  created_at: Date;
};

@Injectable()
export class TenantDomainsRepository {
  async listByTenant(tenantId: string): Promise<TenantDomainRecord[]> {
    return DbClient.callProcedure<TenantDomainRecord>('api_list_tenant_domains', [tenantId]);
  }
}
