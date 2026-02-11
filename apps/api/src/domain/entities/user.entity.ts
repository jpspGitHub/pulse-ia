import { LocaleCode } from '../enums/locale.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string | null;
  status: UserStatus;
  preferred_locale: LocaleCode;
  created_at: Date;
  updated_at: Date;
}
