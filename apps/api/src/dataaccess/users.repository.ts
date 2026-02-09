import { Injectable } from '@nestjs/common';
import { db } from './db';

export type UserRecord = {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  password_hash: string | null;
};

@Injectable()
export class UsersRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await db.query<UserRecord>(
      'SELECT id, tenant_id, email, name, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email],
    );
    return result.rows[0] ?? null;
  }
}
