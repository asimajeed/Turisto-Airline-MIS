import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { query } from "./db";
import userRoutes from "./routes/user";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.text());
app.use(cookieParser());

// Register user
app.post("/register", userRoutes.register);

// Login user
app.post("/login", userRoutes.login);

// Example of a protected route
app.get("/profile", userRoutes.authenticateToken, async (req: Request, res: Response) => {
  try {
    // Assuming `req.user` is added by `authenticateToken` middleware, you might need to define a custom type for the request
    const result = await query("SELECT * FROM users WHERE user_id = $1", [
      (req as any).user.user_id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user profile");
  }
});

// Example route to run custom SQL
app.post("/test/run-sql", async (req: Request, res: Response) => {
  try {
    const result = await query(req.body);
    console.log(req.body);
    const responses = result;
    res.status(200).send(responses);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${JSON.stringify(err)}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
