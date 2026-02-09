import { Pool } from 'pg';
import { env } from '../env';

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function checkDbConnectivity() {
  const client = await db.connect();
  try {
    await client.query('SELECT 1');
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  } finally {
    client.release();
  }
}
