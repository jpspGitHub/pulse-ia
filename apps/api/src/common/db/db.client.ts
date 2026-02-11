import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from '../../env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

function buildCallStatement(procedure: string, params: unknown[]) {
  const placeholders = params.map((_, index) => `$${index + 1}`).join(', ');
  const cursorPlaceholder = `$${params.length + 1}`;
  const args = placeholders ? `${placeholders}, ${cursorPlaceholder}` : cursorPlaceholder;
  return `CALL ${procedure}(${args})`;
}

function createCursorName() {
  return `cur_${Math.random().toString(36).slice(2, 10)}`;
}

export const DbClient = {
  pool,
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
  },
  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  async callProcedure<T extends QueryResultRow = QueryResultRow>(
    procedure: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    return DbClient.transaction(async (client) => {
      const cursor = createCursorName();
      const statement = buildCallStatement(procedure, params);
      await client.query(statement, [...params, cursor]);
      const result = await client.query<T>(`FETCH ALL FROM "${cursor}"`);
      await client.query(`CLOSE "${cursor}"`);
      return result.rows;
    });
  },
  async callProcedureSingle<T extends QueryResultRow = QueryResultRow>(
    procedure: string,
    params: unknown[] = [],
  ): Promise<T | null> {
    const rows = await DbClient.callProcedure<T>(procedure, params);
    return rows[0] ?? null;
  },
  async callProcedureRequired<T extends QueryResultRow = QueryResultRow>(
    procedure: string,
    params: unknown[] = [],
  ): Promise<T> {
    const row = await DbClient.callProcedureSingle<T>(procedure, params);
    if (!row) {
      throw new Error(`Procedure ${procedure} returned no rows`);
    }
    return row;
  },
};
