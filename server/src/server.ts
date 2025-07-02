import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./passport-config";
import { fetchAirports } from "./queryFunctions/publicQueries";
import userRouter from "./routes/user";
import { query } from "./db-config";
import adminRouter from "./routes/admin";
import booking from "./routes/booking";
import flightRouter from "./routes/flights";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

// Middleware

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.json());

app.get("/profile", authMiddleware, (req: Request, res: Response) => {
  if (!(req.user)) {
    res.status(401).send("You need to log in first");
  } else {
    res.send(req.user);
  }
});

app.use("/booking", booking);

app.use("/api/user", userRouter);

app.use("/api/flights", flightRouter);

app.use("/api/admin", adminRouter);

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

app.get("/api/discount", async (req: Request, res: Response) => {
  try {
    const { discount_code } = req.query;

    if (!discount_code) {
      res.status(400).json({
        message: "Missing required query parameter: discount_code",
      });
      return;
    }

    const queryStr = `
      SELECT discount_value 
      FROM discounts 
      WHERE discount_code = $1;
    `;
    const values = [discount_code];

    const result = await query(queryStr, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Invalid discount code",
      });
      return;
    }

    const discountPercentage = result.rows[0].discount_value / 2;

    res.json({ discount_percentage: discountPercentage });
  } catch (error) {
    console.error("Error fetching discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app