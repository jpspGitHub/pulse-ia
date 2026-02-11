import { DbClient } from '../common/db';

export const db = DbClient.pool;

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
