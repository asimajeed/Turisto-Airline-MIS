import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { query } from "../db-config";
import { User } from "../utils/types";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const userResult = await query("SELECT * FROM users WHERE user_id = $1", [payload.user_id]);
    if (!userResult.rows || userResult.rows.length === 0) {
      return;
    }
    req.user = userResult.rows[0] as User;
    next();
  } catch (err) {
    console.error(err);
    next();
  }
}
