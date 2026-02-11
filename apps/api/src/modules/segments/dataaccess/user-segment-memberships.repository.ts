import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';

export type UserSegmentMembershipRecord = {
  id: string;
  tenant_id: string;
  user_id: string;
  segment_id: string;
  start_date: string;
  end_date: string | null;
};

@Injectable()
export class UserSegmentMembershipsRepository {
  async create(input: {
    tenant_id: string;
    user_id: string;
    segment_id: string;
    start_date: string;
    end_date?: string | null;
  }): Promise<UserSegmentMembershipRecord> {
    return DbClient.callProcedureRequired<UserSegmentMembershipRecord>(
      'api_create_user_segment_membership',
      [input.tenant_id, input.user_id, input.segment_id, input.start_date, input.end_date ?? null],
    );
  }
}
