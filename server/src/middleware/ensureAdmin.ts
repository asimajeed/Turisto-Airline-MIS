import { Request, Response, NextFunction } from "express";

// Middleware to check if the user is an admin
const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.is_admin) {
    return next();
  } else {
    res.status(403).send("Forbidden: Admins only");
  }
};

export { ensureAdmin };