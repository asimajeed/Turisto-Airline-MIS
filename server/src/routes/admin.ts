import { query } from "../db-config";
import { Request, Response, Router } from "express";

const adminRouter = Router();

adminRouter.post('/sql' ,async (req: Request, res: Response) => {
  if (!req.user?.is_admin) {
    try {
      res.json(await query(req.body.query));
    } catch (err) {
      res.json({ message: "Server error: " + err });
    }
  } else res.status(401).json({ message: "Unauthorized request" });
})

adminRouter.get("/report", async (req, res) => {
  try {
    const routesQuery = `
      SELECT 
          dep.airport_code || ' - ' || arr.airport_code AS route,
          f.departure_date::DATE AS date,
          COUNT(b.booking_id) AS total_bookings,
          COUNT(c.cancellation_id) AS cancellations
      FROM flights f
      JOIN bookings b ON f.flight_id = b.flight_id
      LEFT JOIN cancellations c ON b.booking_id = c.booking_id
      JOIN airports dep ON f.departure_airport_id = dep.airport_id
      JOIN airports arr ON f.arrival_airport_id = arr.airport_id
      GROUP BY route, date
      HAVING COUNT(b.booking_id) > 0
      ORDER BY date DESC;
    `;

    const revenueQuery = `
      SELECT 
          CONCAT(dep.airport_code, '-', arr.airport_code) AS flight,
          SUM(b.total_price) AS revenue
      FROM bookings b
      JOIN flights f ON b.flight_id = f.flight_id
      JOIN airports dep ON f.departure_airport_id = dep.airport_id
      JOIN airports arr ON f.arrival_airport_id = arr.airport_id
      GROUP BY flight
      ORDER BY flight;
    `;

    const discountsQuery = `
      SELECT 
          COALESCE(SUM(b.total_price * d.discount_percentage / 100), 0) AS discounts_applied
      FROM bookings b
      JOIN discounts d ON b.discount_code = d.discount_code;
    `;

    const [routes, revenueBreakdown, discounts] = await Promise.all([
      query(routesQuery),
      query(revenueQuery),
      query(discountsQuery)
    ]);

    res.json({
      routes: routes.rows,
      revenueBreakdown: revenueBreakdown.rows,
      totalRevenue: revenueBreakdown.rows.reduce((acc, curr) => acc + parseFloat(curr.revenue || 0), 0)
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default adminRouter;