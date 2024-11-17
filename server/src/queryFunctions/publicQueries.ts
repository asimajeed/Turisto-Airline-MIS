// Queries anyone on the internet can run on the database, no authorization required

import { query } from "../db-config";

export async function fetchAirports(search: string, limit: number, offset: number) {
  try {
    const result = await query(
      `
      SELECT airport_id, airport_code, airport_name, city, country, latitude, longitude
      FROM airports
      WHERE airport_name ILIKE $1 OR airport_code ILIKE $1 OR city ILIKE $1
      LIMIT $2 OFFSET $3
      `,
      [`%${search}%`, limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching airports:", err);
    throw new Error("Failed to fetch airports: " + err);
  }
}
