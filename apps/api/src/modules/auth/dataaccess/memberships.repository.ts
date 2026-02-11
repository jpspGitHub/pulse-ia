import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { Role } from '../../../domain/enums/role.enum';

export type MembershipRecord = {
  id: string;
  tenant_id: string;
  user_id: string;
  role: Role;
};

@Injectable()
export class MembershipsRepository {
  async findRole(tenantId: string, userId: string): Promise<Role | null> {
    const record = await DbClient.callProcedureSingle<{ role: Role }>('api_get_membership_role', [
      tenantId,
      userId,
    ]);
    return record?.role ?? null;
  }
}
