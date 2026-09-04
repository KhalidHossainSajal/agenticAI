import { randomBytes } from 'crypto';
import { getPool } from '../db/pool';

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await getPool().query<import('mysql2').RowDataPacket[]>(
    'SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
    [email],
  );
  return (rows[0] as UserRow | undefined) ?? null;
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const [rows] = await getPool().query<import('mysql2').RowDataPacket[]>(
    'SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return (rows[0] as UserRow | undefined) ?? null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<UserRow> {
  const [result] = await getPool().query<import('mysql2').ResultSetHeader>(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
    [input.email, input.passwordHash, input.name],
  );
  const id = Number(result.insertId);
  const row = await findUserById(id);
  if (!row) throw new Error('user insert succeeded but row not found');
  return row;
}

export function newJti(): string {
  return randomBytes(16).toString('hex');
}
