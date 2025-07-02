import { query } from "../db-config";
import { DatabaseError } from "pg";
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const flightRouter = Router();


// Create a flight
flightRouter.get("/", async (req: Request, res: Response) => {
  try {
    const {
      departure_date,
      departure_airport_id,
      arrival_airport_id,
      page = 0,
      sorting,
    } = req.query;

    if (!departure_date || !departure_airport_id || !arrival_airport_id) {
      res.status(400).json({
        message:
          "Missing required query parameters: departure_date, departure_airport_id, arrival_airport_id",
      });
      return;
    }

    const sortingStr = (sortOption: any): string | null => {
      switch (parseInt(sortOption)) {
        case 1:
          return "ORDER BY base_price ASC";
        case 2:
          return "ORDER BY departure_date ASC";
        case 3:
          return "ORDER BY status ASC";
        case 4:
          return "ORDER BY base_price DESC";
        case 5:
          return "ORDER BY departure_date DESC";
        case 6:
          return "ORDER BY status DESC";
        default:
          return "";
      }
    };

    const limit = 6; // Items per page
    const offset = parseInt(page as string) * limit;

    // Query for paginated results
    const queryStr = `
SELECT 
  flight_id, 
  flight_number, 
  departure_airport_id, 
  arrival_airport_id, 
  departure_date, 
  arrival_date, 
  total_seats, 
  status, 
  base_price
FROM flights
WHERE departure_date >= $1::timestamp
  AND departure_date < ($1::timestamp + INTERVAL '1 day')
  AND departure_airport_id = $2
  AND arrival_airport_id = $3
${sortingStr(sorting)}
LIMIT $4 OFFSET $5;`;

    const countQueryStr = `
SELECT COUNT(*) as total
FROM flights
WHERE departure_date >= $1::timestamp
  AND departure_date < ($1::timestamp + INTERVAL '1 day')
  AND departure_airport_id = $2
  AND arrival_airport_id = $3;`;

    const queryValues = [
      departure_date,
      departure_airport_id,
      arrival_airport_id,
      limit,
      offset,
    ];

    const countValues = [
      departure_date,
      departure_airport_id,
      arrival_airport_id,
    ];

    const result = await query(queryStr, queryValues);
    const countResult = await query(countQueryStr, countValues);

    const totalResults = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalResults / limit);
    const currentPage = parseInt(page as string);

    res.json({
      flights: result.rows,
      totalPages,
      currentPage,
      totalResults,
    });
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


flightRouter.get("/:searchId", async (req, res) => {
  const searchId = req.params.searchId;

  // Validate `searchId`
  if (!searchId) {
    res.status(400).json({ message: "Flight ID is required." });
    return;
  }

  try {
    // Execute query
    const result = await query("SELECT * FROM flights WHERE flight_id = $1", [
      searchId,
    ]);

    // Check if flight exists
    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ message: "No flight corresponds to the provided Flight ID." });
      return;
    }

    // Return the flight details
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching flight details:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

flightRouter.put("/:flightId", authMiddleware, async (req, res) => {
  if (!(req.user?.is_admin)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  const { flightId } = req.params;
  const {
    flight_number,
    departure_airport_id,
    arrival_airport_id,
    departure_date,
    arrival_date,
    total_seats,
    status,
    base_price,
  } = req.body;

  // Validate input
  if (!flightId) {
    res.status(400).json({ message: "Flight ID is required." });
    return;
  }

  try {
    // Check if the flight exists
    const flightCheck = await query(
      "SELECT * FROM flights WHERE flight_id = $1",
      [flightId]
    );
    if (flightCheck.rows.length === 0) {
      res.status(404).json({ message: "Flight not found." });
      return;
    }

    // Update the flight details
    const updateQuery = `
      UPDATE flights
      SET
        flight_number = $1,
        departure_airport_id = $2,
        arrival_airport_id = $3,
        departure_date = $4,
        arrival_date = $5,
        total_seats = $6,
        status = $7,
        base_price = $8
      WHERE flight_id = $9
    `;
    await query(updateQuery, [
      flight_number,
      departure_airport_id,
      arrival_airport_id,
      departure_date,
      arrival_date,
      total_seats,
      status,
      base_price,
      flightId,
    ]);
    res.status(200).json({ message: "Flight updated successfully." });
  } catch (err) {
    console.error("Error updating flight:", err);
    if (err instanceof DatabaseError)
      res.status(500).json({ message: `${err.detail}` });
    else
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
  }
});

flightRouter.get("/seats/:flight_id", async (req, res) => {
  const flightId = req.params.flight_id;
  try {
    const result = await query(
      `
      SELECT seat_number 
      FROM seat_list 
      WHERE seat_id IN (
          SELECT seat_id 
          FROM seat_allocation 
          WHERE flight_id = $1
      )
      `,
      [flightId]
    );
    res.json(result.rows.map((row) => row.seat_number));
  } catch (err) {
    console.error(err);
    if (err instanceof DatabaseError)
      res.status(500).json({ message: `${err.detail}` });
    else res.status(500).send("Error fetching seats");
  }
});

flightRouter.delete(
  "/delete/:flight_id", authMiddleware,
  async (req: Request, res: Response) => {
    if (!(req.user?.is_admin)) {
      res.status(403).json({ message: "Unauthorized request" });
      return;
    }
    const { flight_id } = req.params;

    try {
      const result = await query(
        "DELETE FROM flights WHERE flight_id = $1 RETURNING *",
        [flight_id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: "Flight not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Flight deleted successfully", flight_id });
    } catch (err) {
      console.error("Error deleting flight:", err);
      if (err instanceof DatabaseError)
        res.status(500).json({ message: `${err.detail}` });
      else res.status(500).json({ message: "Error deleting the flight" });
    }
  }
);

export default flightRouter;
