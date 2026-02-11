import { Role } from '../enums/role.enum';

export interface Membership {
  id: string;
  tenant_id: string;
  user_id: string;
  role: Role;
  created_at: Date;
}
