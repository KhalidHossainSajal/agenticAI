import { getPool } from '../db/pool';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface BusinessRow {
  id: number;
  name: string;
  slug: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export type BusinessRoleValue = 'owner' | 'admin' | 'member';

export interface PublicBusiness {
  id: number;
  name: string;
  slug: string;
  createdBy: number;
  createdAt: string;
  role: BusinessRoleValue;
}

export function toPublicBusiness(row: BusinessRow, role: BusinessRoleValue): PublicBusiness {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdBy: row.created_by,
    createdAt: row.created_at.toISOString(),
    role,
  };
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'business'
  );
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 1;
  while (true) {
    const [rows] = await getPool().query<RowDataPacket[]>(
      'SELECT id FROM businesses WHERE slug = ? LIMIT 1',
      [candidate],
    );
    if (rows.length === 0) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function createBusiness(input: { name: string; createdBy: number }): Promise<BusinessRow> {
  const slug = await uniqueSlug(slugify(input.name));
  const [result] = await getPool().query<ResultSetHeader>(
    'INSERT INTO businesses (name, slug, created_by) VALUES (?, ?, ?)',
    [input.name, slug, input.createdBy],
  );
  const id = Number(result.insertId);
  const row = await findBusinessById(id);
  if (!row) throw new Error('business insert succeeded but row not found');
  return row;
}

export async function findBusinessById(id: number): Promise<BusinessRow | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT id, name, slug, created_by, created_at, updated_at FROM businesses WHERE id = ? LIMIT 1',
    [id],
  );
  return (rows[0] as BusinessRow | undefined) ?? null;
}

export async function listBusinessesForUser(
  userId: number,
): Promise<Array<BusinessRow & { role: BusinessRoleValue }>> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT b.id, b.name, b.slug, b.created_by, b.created_at, b.updated_at, m.role
       FROM businesses b
       INNER JOIN business_members m ON m.business_id = b.id
      WHERE m.user_id = ?
      ORDER BY b.created_at DESC`,
    [userId],
  );
  return rows as Array<BusinessRow & { role: BusinessRoleValue }>;
}

export async function updateBusiness(id: number, name: string): Promise<BusinessRow> {
  await getPool().query('UPDATE businesses SET name = ? WHERE id = ?', [name, id]);
  const row = await findBusinessById(id);
  if (!row) throw new Error('business vanished after update');
  return row;
}

export async function addMember(input: {
  businessId: number;
  userId: number;
  role: BusinessRoleValue;
}): Promise<void> {
  await getPool().query(
    'INSERT INTO business_members (business_id, user_id, role) VALUES (?, ?, ?)',
    [input.businessId, input.userId, input.role],
  );
}

export interface MemberRow {
  id: number;
  userId: number;
  email: string;
  name: string;
  role: BusinessRoleValue;
  createdAt: string;
}

export async function listMembers(businessId: number): Promise<MemberRow[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT m.id, m.user_id, u.email, u.name, m.role, m.created_at
       FROM business_members m
       INNER JOIN users u ON u.id = m.user_id
      WHERE m.business_id = ?
      ORDER BY m.created_at ASC`,
    [businessId],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    userId: Number(r.user_id),
    email: String(r.email),
    name: String(r.name),
    role: r.role as BusinessRoleValue,
    createdAt: (r.created_at as Date).toISOString(),
  }));
}
