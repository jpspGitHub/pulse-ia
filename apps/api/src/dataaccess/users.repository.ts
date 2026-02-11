import { Injectable } from '@nestjs/common';
import { DbClient } from '../common/db';
import { LocaleCode } from '../domain/enums/locale.enum';
import { UserStatus } from '../domain/enums/user-status.enum';

export type UserRecord = {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string | null;
  status: UserStatus;
  preferred_locale: LocaleCode;
};

@Injectable()
export class UsersRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return DbClient.callProcedureSingle<UserRecord>('api_get_user_by_email', [email]);
  }
}
