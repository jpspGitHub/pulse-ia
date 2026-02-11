import { Injectable } from '@nestjs/common';
import { DbClient } from '../../../common/db';
import { LocaleCode } from '../../../domain/enums/locale.enum';
import { Role } from '../../../domain/enums/role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';

export type LocalAuthRecord = {
  user_id: string;
  tenant_id: string;
  email: string;
  full_name: string | null;
  status: UserStatus;
  preferred_locale: LocaleCode;
  role: Role | null;
  password_hash: string | null;
  email_verified: boolean;
};

@Injectable()
export class AuthIdentitiesRepository {
  async findLocalByEmail(email: string): Promise<LocalAuthRecord | null> {
    return DbClient.callProcedureSingle<LocalAuthRecord>('api_get_auth_local_by_email', [email]);
  }
}
