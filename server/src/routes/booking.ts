import { query } from "../db-config";
import { Router } from "express";

const router: Router = Router();

// Utility function to create a guest user if not logged in
async function createGuestUser(
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string
) {
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

async function getGuestUserByEmail(email: string) {
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
  } = req.body;

  if (!flight_id || !seat_number) {
    res.status(400).json({ error: "Incomplete information" });
    return;
  }

  let user_id;

  if (req.user) {
    user_id = req.user.user_id; 
  } else {
    if (!first_name || !last_name || !email) {
      res.status(400).json({ error: "Missing guest user information" });
      return;
    }

    const existingGuestUser = await getGuestUserByEmail(email);
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

  // Check if the flight and seat exist
  const flightCheckQuery = "SELECT * FROM flights WHERE flight_id = $1";
  const flightResult = await query(flightCheckQuery, [flight_id]);
  if (flightResult.rows.length === 0) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  const seatCheckQuery = "SELECT * FROM seat_list WHERE seat_number = $1";
  const seatResult = await query(seatCheckQuery, [seat_number]);
  if (seatResult.rows.length === 0) {
    res.status(404).json({ error: "Seat not found" });
    return;
  }

  let discount_value = 0;
  if (discountCode) {
    const discountQuery =
      "SELECT discount_value FROM discounts WHERE discount_code = $1 AND valid_from <= NOW() AND valid_to >= NOW()";
    const discountResult = await query(discountQuery, [discountCode]);
    if (discountResult.rows.length > 0) {
      discount_value = discountResult.rows[0].discount_value;
    }
  }

  const base_price = flightResult.rows[0].base_price;
  const final_price = base_price - base_price * (discount_value / 100);

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
    VALUES ($1, $2, $3, $4, 'confirmed', $5)
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

  // Handle group bookings (if there are passengers)
  if (passengers && passengers.length > 0) {
    // Create group booking entry
    const groupBookingQuery = `
      INSERT INTO group_bookings (main_booking_id, group_size, group_discount)
      VALUES ($1, $2, $3)
      RETURNING group_booking_id
    `;
    const groupBookingResult = await query(groupBookingQuery, [
      booking_id,
      passengers.length,
      discount_value,
    ]);
    const group_booking_id = groupBookingResult.rows[0].group_booking_id;

    // For each passenger in the group, create their individual booking and allocate seats
    for (const passenger of passengers) {
      const { first_name, last_name, date_of_birth, email, seat } = passenger;

      // Create passenger as a guest user if necessary
      let passenger_user_id = user_id; // Default to main user's ID
      if (!req.user) {
        passenger_user_id = await createGuestUser(
          first_name,
          last_name,
          email,
          phone_number
        );
      }

      // Find available seat for passenger
      const passengerSeatQuery =
        "SELECT seat_id FROM seat_list WHERE seat_number = $1";
      const seatResult = await query(passengerSeatQuery, [seat]);
      const passenger_seat_id = seatResult.rows[0].seat_id;

      // Insert individual passenger booking
      const passengerBookingQuery = `
        INSERT INTO bookings (user_id, flight_id, seat_id, total_price, booking_status, group_booking_id)
        VALUES ($1, $2, $3, $4, 'confirmed', $5)
      `;
      await query(passengerBookingQuery, [
        passenger_user_id,
        flight_id,
        passenger_seat_id,
        final_price,
        group_booking_id,
      ]);
    }
  }

  // Send confirmation response
  res.status(200).json({ booking_id, message: "Booking successful" });
});

export default router;
