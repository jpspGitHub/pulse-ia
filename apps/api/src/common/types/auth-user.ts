import { LocaleCode } from '../../domain/enums/locale.enum';
import { Role } from '../../domain/enums/role.enum';

export type AuthUser = {
  sub: string;
  email: string;
  tenantId: string;
  name?: string | null;
  role: Role;
  locale?: LocaleCode;
};
