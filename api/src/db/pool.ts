import mysql from 'mysql2/promise';
import { env } from '../config/env';

let poolInstance: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (poolInstance) return poolInstance;

  poolInstance = mysql.createPool({
    uri: env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false,
    decimalNumbers: true,
    timezone: 'Z',
  });

  return poolInstance;
}

export async function pingDatabase(): Promise<void> {
  const conn = await getPool().getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}

export async function closePool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
  }
}
