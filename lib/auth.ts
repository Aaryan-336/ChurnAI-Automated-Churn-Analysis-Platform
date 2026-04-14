import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret-change-me';
const COOKIE_NAME = 'churnai-token';

export interface JWTPayload {
  userId: string;
  email: string;
}

/** Hash a plaintext password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** Compare plaintext against hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT token */
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Set auth cookie (server-side) */
export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/** Remove auth cookie (server-side) */
export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Get current user from cookie (server-side) */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    // Demo Mode fallback
    return { userId: 'demo-user-id', email: 'demo@churnai.io' };
  }
  return verifyToken(token);
}
