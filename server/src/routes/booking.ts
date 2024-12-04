import { query } from "../db-config";
import { Router, Request, Response } from "express";

const router: Router = Router();

// Utility function to create a guest user if not logged in
async function createGuestUser(
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string
) {
  const userResult = await query("SELECT user_id FROM users WHERE email = $1", [
    email,
  ]);
  if (userResult.rows.length > 0) {
    return userResult.rows[0].user_id;
  }

  const queryStr = `
    INSERT INTO users (first_name, last_name, email, phone_number, is_guest)
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING user_id
  `;
  const result = await query(queryStr, [
    first_name,
    last_name,
    email,
    phone_number,
  ]);

  return result.rows[0].user_id;
}

async function getUserByEmail(email: string) {
  const queryStr =
    "SELECT user_id FROM users WHERE email = $1 AND is_guest = TRUE";
  const result = await query(queryStr, [email]);
  return result.rows[0];
}

router.post("/create", async (req, res) => {
  const {
    flight_id,
    seat_number,
    total_price,
    discountCode,
    first_name,
    last_name,
    email,
    phone_number,
    passengers,
    payment_method,
    payment_amount,
  } = req.body;

  if (!flight_id || !seat_number || !payment_method || !payment_amount) {
    res.status(400).json({ message: "Incomplete information" });
    console.log(flight_id, seat_number, payment_method, payment_amount);
    return;
  }

  let user_id;
  await query("BEGIN");

  try {
    if (req.user) {
      user_id = req.user.user_id;
    } else {
      if (!first_name || !last_name || !email) {
        res.status(400).json({ message: "Missing guest user information" });
        return;
      }

      const existingGuestUser = await getUserByEmail(email);
      if (existingGuestUser) {
        user_id = existingGuestUser.user_id;
      } else {
        user_id = await createGuestUser(
          first_name,
          last_name,
          email,
          phone_number
        );
      }
    }

    // Verify flight and seat existence
    const flightCheckQuery = "SELECT * FROM flights WHERE flight_id = $1";
    const flightResult = await query(flightCheckQuery, [flight_id]);
    if (flightResult.rows.length === 0) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    const seatCheckQuery = "SELECT * FROM seat_list WHERE seat_number = $1";
    const seatResult = await query(seatCheckQuery, [seat_number]);
    if (seatResult.rows.length === 0) {
      res.status(404).json({ message: "Seat not found" });
      return;
    }

    // Handle discounts
    let discount_value = 0;
    if (discountCode) {
      const discountQuery =
        "SELECT discount_value FROM discounts WHERE discount_code = $1 AND valid_from <= NOW() AND valid_to >= NOW()";
      const discountResult = await query(discountQuery, [discountCode]);
      if (discountResult.rows.length > 0) {
        discount_value = discountResult.rows[0].discount_value;
      } else {
        await query("ROLLBACK");
        res.status(404).json({ message: "Discount code not found" });
        return;
      }
    }

    const base_price = flightResult.rows[0].base_price;
    const final_price = base_price - base_price * (discount_value / 100);

    // Check if payment amount matches final price
    if (payment_amount < final_price) {
      await query("ROLLBACK");
      res.status(400).json({ message: "Payment amount is insufficient" });
      return;
    }

    // Mock payment verification
    const paymentVerified = true; // Replace this with actual payment gateway logic
    if (!paymentVerified) {
      await query("ROLLBACK");
      res.status(400).json({ message: "Payment verification failed" });
      return;
    }

    // Allocate seat and create booking
    const seatBookingQuery = `
    INSERT INTO seat_allocation (flight_id, seat_id)
    VALUES ($1, (SELECT seat_id FROM seat_list WHERE seat_number = $2))
    RETURNING seat_id
  `;
    const seatBookingResult = await query(seatBookingQuery, [
      flight_id,
      seat_number,
    ]);
    const seat_id = seatBookingResult.rows[0].seat_id;

    const bookingQuery = `
    INSERT INTO bookings (user_id, flight_id, seat_id, total_price, booking_status, discount_code)
    VALUES ($1, $2, $3, $4, 'pending', $5)
    RETURNING booking_id
  `;
    const bookingResult = await query(bookingQuery, [
      user_id,
      flight_id,
      seat_id,
      final_price,
      discountCode,
    ]);
    const booking_id = bookingResult.rows[0].booking_id;
    // Create ticket for main booking
    const ticketQuery = `
    INSERT INTO tickets (booking_id, ticket_status)
    VALUES ($1, 'issued')
    RETURNING ticket_id
    `;
    const ticketResult = await query(ticketQuery, [booking_id]);
    const ticket_id = ticketResult.rows[0].ticket_id;

    // Record payment
    const paymentQuery = `
    INSERT INTO payments (booking_id, payment_amount, payment_status, payment_method)
    VALUES ($1, $2, 'completed', $3)
    RETURNING payment_id
  `;
    await query(paymentQuery, [booking_id, payment_amount, payment_method]);

    // Update booking status to confirmed
    const updateBookingQuery = `
    UPDATE bookings
    SET booking_status = 'confirmed'
    WHERE booking_id = $1
  `;
    await query(updateBookingQuery, [booking_id]);

    // Handle group bookings (if any passengers)
    if (passengers && passengers.length > 0) {
      const groupBookingQuery = `
      INSERT INTO group_bookings (main_booking_id, group_size, group_discount)
      VALUES ($1, $2, $3)
      RETURNING group_booking_id
    `;
      const groupBookingResult = await query(groupBookingQuery, [
        booking_id,
        passengers.length,
        0.1,
      ]);
      const group_booking_id = groupBookingResult.rows[0].group_booking_id;

      for (const passenger of passengers) {
        const { first_name, last_name, email, seat } = passenger;
        const passenger_user_id = await createGuestUser(
          first_name,
          last_name,
          email,
          phone_number
        );

        const passenger_seat_id = (
          await query(
            `
          INSERT INTO seat_allocation (flight_id, seat_id)
          VALUES ($1, (SELECT seat_id FROM seat_list WHERE seat_number = $2)) RETURNING seat_id
        `,
            [flight_id, seat]
          )
        ).rows[0].seat_id;

        const passengerBookingQuery = `
        INSERT INTO bookings (user_id, flight_id, seat_id, total_price, booking_status, group_booking_id)
        VALUES ($1, $2, $3, $4, 'confirmed', $5)
        returning booking_id`;

        const passengerBookingId = (
          await query(passengerBookingQuery, [
            passenger_user_id,
            flight_id,
            passenger_seat_id,
            final_price,
            group_booking_id,
          ])
        ).rows[0].booking_id;
        const passengerTicketQuery = `
        INSERT INTO tickets (booking_id, ticket_status)
        VALUES ($1, 'issued')
        RETURNING ticket_id`;
        const passengerTicketResult = await query(passengerTicketQuery, [
          passengerBookingId,
        ]);
        const passengerTicketId = passengerTicketResult.rows[0].ticket_id;
      }
    }
    await query("COMMIT");
    res
      .status(200)
      .json({ booking_id, message: "Booking and payment successful" });
  } catch (error: any) {
    await query("ROLLBACK");
    console.error("Transaction failed:", error);
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
});

router.get("/ticket/:bookingId", async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    res.status(400).json({ error: "Booking ID is required." });
    return;
  }

  try {
    // Fetch booking, user, flight, and ticket details using the booking ID
    const bookingQuery = `
      SELECT 
        b.booking_id,
        b.total_price,
        u.first_name,
        u.last_name,
        f.flight_number,
        f.departure_date,
        f.arrival_date,
        da.city AS departure_city,
        aa.city AS arrival_city,
        t.ticket_id
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN flights f ON b.flight_id = f.flight_id
      JOIN airports da ON f.departure_airport_id = da.airport_id
      JOIN airports aa ON f.arrival_airport_id = aa.airport_id
      JOIN tickets t ON b.booking_id = t.booking_id
      WHERE b.booking_id = $1
    `;

    const bookingResult = await query(bookingQuery, [bookingId]);

    if (bookingResult.rows.length === 0) {
      res.status(404).json({ error: "Booking not found." });
      return;
    }

    const bookingData = bookingResult.rows[0];

    // Map the result to the expected format
    const responseData = {
      user: {
        first_name: bookingData.first_name,
        last_name: bookingData.last_name,
      },
      booking: {
        booking_id: bookingData.booking_id,
        total_price: bookingData.total_price,
      },
      flight: {
        flight_number: bookingData.flight_number,
        departure_airport: {
          city: bookingData.departure_city,
        },
        arrival_airport: {
          city: bookingData.arrival_city,
        },
        departure_date: bookingData.departure_date,
        arrival_date: bookingData.arrival_date,
      },
      ticket: {
        ticket_id: bookingData.ticket_id,
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching ticket data." });
  }
});

router.get("/history", async (req, res) => {
  if (!(req.isAuthenticated() && req.user)) return;
  const userId = req.user.user_id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const bookingHistoryQuery = `
      SELECT 
          b.user_id,
          b.booking_id,
          b.booking_date AS action_date,
          'Booking Created' AS action_type
      FROM 
          bookings b
      WHERE 
          b.user_id = $1

      UNION ALL

      SELECT 
          gb_main.user_id AS user_id,
          gb.group_booking_id AS booking_id,
          b.booking_date AS action_date,
          'Group Booking Created' AS action_type
      FROM 
          group_bookings gb
      JOIN 
          bookings gb_main ON gb.main_booking_id = gb_main.booking_id
      JOIN 
          bookings b ON gb.group_booking_id = b.booking_id
      WHERE 
          gb_main.user_id = $1

      ORDER BY action_date DESC;
    `;

    const results = await query(bookingHistoryQuery, [userId]);

    res.json(results.rows);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
