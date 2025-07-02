import jwt from 'jsonwebtoken';
import { User } from './types';
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export function generateAccessToken(user: User) {
  return jwt.sign({ user_id: user.user_id }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(user: User) {
  return jwt.sign({ user_id: user.user_id }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { user_id: number };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as { user_id: number };
}
