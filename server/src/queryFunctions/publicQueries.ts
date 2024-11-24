// Queries anyone on the internet can run on the database, no authorization required

import { query } from "../db-config";

export async function fetchAirports(
  search: string,
  limit: number,
  offset: number
) {
  try {
    if (search) {
      const result = await query(
        `SELECT * FROM airports WHERE airport_name
        ILIKE $1 OR airport_code ILIKE $1 OR city ILIKE $1 OR country ILIKE $1 LIMIT $2 OFFSET $3`,
        [`${search}%`, limit, offset]
      );
      return result.rows;
    }
    const result = await query(
      `SELECT * FROM airports WHERE airport_code IN ('LHR', 'DXB', 'KHI', 'LHE', 'HND', 'CAN', 'DFW', 'ATL', 'DEN', 'ORD', 'IST')`
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching airports:", err);
    throw new Error("Failed to fetch airports: " + err);
  }
}
