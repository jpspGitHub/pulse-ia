import { AuthProvider } from '../enums/auth-provider.enum';

export interface AuthIdentity {
  id: string;
  tenant_id: string;
  user_id: string;
  provider: AuthProvider;
  provider_subject: string | null;
  password_hash: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
