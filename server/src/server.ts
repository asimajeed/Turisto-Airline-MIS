import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { query } from "./db-config";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import "./passport-config";
import { fetchAirports } from "./queryFunctions/publicQueries";

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Register user
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if ((await query("SELECT 1 FROM users WHERE email = $1", [email])).rows[0])
      res.status(400).send("User already exists");
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, hashedPassword]
      );
      res.status(201).send("User registered");
    }
  } catch (err) {
    res.status(500).send("Error registering user");
    console.error(err);
  }
});

// Login user
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user);
});

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed" });
    }
    res.clearCookie('connect.sid').send({ message: "Logged out successfully" });
  });
});

app.get("/profile", (req: Request, res: Response) => {
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) {
    res.status(401).send("You need to log in first");
  } else {
    res.send(req.user);
  }
});

app.post("/admin/sql", async (req: Request, res: Response) => {
  console.log(req.isAuthenticated(), req.user, req.user?.is_admin)
  if (req.isAuthenticated() && req.user.is_admin) {
    try {
      res.json(await query(req.body.query));
    } catch (err) {
      res.json({ message: "Server error: " + err });
    }
  } else res.status(401).json({ message: "Unauthorized request" });
});

app.get("/api/airports", async (req, res) => {
  const search = req.query.search as string;
  const limit = 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  try {
    const airports = await fetchAirports(search, limit, offset);
    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
