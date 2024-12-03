import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./passport-config";
import { fetchAirports } from "./queryFunctions/publicQueries";
import userRouter from "./routes/user";
import { sql } from "./routes/admin";
import booking from "./routes/booking";
import flightRouter from "./routes/flights";

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


app.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You need to log in first");
  } else {
    res.send(req.user);
  }
});

// Use the booking routes
app.use('/booking', booking);

app.use('/api/user', userRouter)

app.post("/admin/sql", sql);

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

app.use('/api/flights', flightRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
