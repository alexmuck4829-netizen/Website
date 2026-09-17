import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Session handling.
 *
 * Dev mode uses signed HTTP-only cookies so the whole flow (admin gate, library
 * ownership, downloads) is testable without external services. When you connect
 * Supabase Auth, replace getAdminSession/getCustomerSession with Supabase's
 * session lookup — the call sites already expect "session or null".
 */

const ADMIN_COOKIE = 'omc_admin_session';
const CUSTOMER_COOKIE = 'omc_customer_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-only-auth-secret-change-me';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'omc-admin';
export const IS_DEV_AUTH = !process.env.ADMIN_PASSWORD;

function sign(value: string): string {
  return createHmac('sha256', SECRET).update(value).digest('hex');
}

function seal(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function unseal<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = sign(body);
  try {
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as T & { exp?: number };
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export interface AdminSession {
  id: string;
  role: 'admin';
  exp: number;
}

export interface CustomerSession {
  email: string;
  name?: string;
  exp: number;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
};

export const AuthService = {
  verifyAdminPassword(password: string): boolean {
    const a = Buffer.from(password);
    const b = Buffer.from(ADMIN_PASSWORD);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  },

  async startAdminSession(): Promise<void> {
    const store = await cookies();
    const payload: AdminSession = { id: randomUUID(), role: 'admin', exp: Date.now() + MAX_AGE * 1000 };
    store.set(ADMIN_COOKIE, seal(payload), cookieOptions);
  },

  async endAdminSession(): Promise<void> {
    const store = await cookies();
    store.delete(ADMIN_COOKIE);
  },

  async getAdminSession(): Promise<AdminSession | null> {
    const store = await cookies();
    return unseal<AdminSession>(store.get(ADMIN_COOKIE)?.value);
  },

  async requireAdmin(): Promise<AdminSession> {
    const session = await AuthService.getAdminSession();
    if (!session) throw new Error('UNAUTHORISED');
    return session;
  },

  async startCustomerSession(email: string, name?: string): Promise<CustomerSession> {
    const store = await cookies();
    const payload: CustomerSession = {
      email: email.toLowerCase().trim(),
      name,
      exp: Date.now() + MAX_AGE * 1000,
    };
    store.set(CUSTOMER_COOKIE, seal(payload), cookieOptions);
    return payload;
  },

  async getCustomerSession(): Promise<CustomerSession | null> {
    const store = await cookies();
    return unseal<CustomerSession>(store.get(CUSTOMER_COOKIE)?.value);
  },

  async endCustomerSession(): Promise<void> {
    const store = await cookies();
    store.delete(CUSTOMER_COOKIE);
  },
};

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
export const CUSTOMER_COOKIE_NAME = CUSTOMER_COOKIE;
