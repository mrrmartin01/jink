import { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const ACCESS_COOKIE_OPTIONS = (secure = false): CookieOptions => ({
  httpOnly: true,
  secure,
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 60 * 1000, // 15 minutes
});

export const REFRESH_COOKIE_OPTIONS = (secure = false): CookieOptions => ({
  httpOnly: true,
  secure,
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
