import { query } from "../db-config";
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

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

router.use(authMiddleware);

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
  } = req.body;
  let { payment_amount } = req.body;
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
    } else payment_amount = final_price;

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
        passengers.length + 1,
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
      query(
        "UPDATE users set loyalty_points=loyalty_points+$1 where user_id = $2",
        [total_price, req.user?.user_id]
      );
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

router.get("/history", authMiddleware, async (req, res) => {
  // Check authentication
  if (!(req.user)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = req.user.user_id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const bookingHistoryQuery = `
      SELECT
          u.email, 
          b.user_id,
          b.booking_id,
          b.booking_date AS action_date,
          'Booking Created' AS action_type
      FROM 
          bookings b
      JOIN 
          users u ON b.user_id = u.user_id
      WHERE 
          b.user_id = $1

      UNION ALL

      SELECT
          u.email,
          gb_main.user_id AS user_id,
          b.booking_id AS booking_id,  -- Individual booking ID, not group_booking_id
          b.booking_date AS action_date,
          'Group Booking Created' AS action_type
      FROM 
          bookings b
      JOIN
          users u ON b.user_id = u.user_id
      JOIN
          group_bookings gb ON gb.group_booking_id = b.group_booking_id
      JOIN
          bookings gb_main ON gb.main_booking_id = gb_main.booking_id
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

router.delete("/:booking_id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  const booking_id = Number(req.params.booking_id);
  const user_id = req.user.user_id;
  if (!booking_id) {
    res.status(400).json({ message: "Missing booking_id" });
    return;
  }

  // Begin transaction
  await query("BEGIN");

  try {
    const bookingQuery = `
      SELECT b.booking_id, b.flight_id, b.seat_id, b.total_price, b.booking_status
      FROM bookings b
      WHERE b.booking_id = $1 AND b.user_id = $2
    `;
    const bookingResult = await query(bookingQuery, [booking_id, user_id]);

    if (bookingResult.rows.length === 0) {
      await query("ROLLBACK");
      res.status(404).json({ message: "Booking not found or unauthorized" });
      return;
    }

    const booking = bookingResult.rows[0];
    if (booking.booking_status === "canceled") {
      await query("ROLLBACK");
      res.status(400).json({ message: "Booking is already canceled" });
      return;
    }
    console.log("Cancelling booking_id:", booking_id);

    const removeSeatQuery = `
      DELETE FROM seat_allocation
      WHERE flight_id = $1 AND seat_id = $2
    `;
    await query(removeSeatQuery, [booking.flight_id, booking.seat_id]);
    console.log("ts");
    const updateBookingQuery = `
      UPDATE bookings
      SET booking_status = 'canceled'
      WHERE booking_id = $1
    `;
    await query(updateBookingQuery, [booking_id]);

    const refundAmount = booking.total_price; // Full refund
    const refundStatus = "completed";
    console.error("test");
    const insertCancellationQuery = `
      INSERT INTO cancellations (booking_id, cancellation_date, refund_amount, cancellation_reason, refund_status)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)
    `;
    await query(insertCancellationQuery, [
      booking_id,
      refundAmount,
      "",
      refundStatus,
    ]);
    console.error("testTWO");

    await query("COMMIT");

    res.status(200).json({
      message: "Booking canceled successfully",
      refund_amount: refundAmount,
    });
  } catch (error: any) {
    await query("ROLLBACK");
    console.error("Error during booking cancellation:", error);
    res
      .status(500)
      .json({ message: "Booking cancellation failed", error: error.message });
  }
});

router.get("/:booking_id", async (req, res) => {
  const booking_id = req.params.booking_id;

  if (!booking_id) {
    res.status(400).json({ message: "Missing booking_id" });
    return;
  }

  try {
    const queryText = `
      SELECT b.flight_id, b.seat_id, f.flight_number
      FROM bookings b
      JOIN flights f ON b.flight_id = f.flight_id
      WHERE b.booking_id = $1
    `;
    const result = await query(queryText, [booking_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching flight details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
