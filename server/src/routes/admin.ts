import { query } from "../db-config";
import { Request, Response } from "express";

const sql = async (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    try {
      res.json(await query(req.body.query));
    } catch (err) {
      res.json({ message: "Server error: " + err });
    }
  } else res.status(401).json({ message: "Unauthorized request" });
}

export { sql };