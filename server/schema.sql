CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone_number VARCHAR(50),
    date_of_birth DATE,
    loyalty_points INT DEFAULT 0,
    loyalty_points_redeemed INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPT,
    is_admin BOOLEAN DEFAULT FALSE,
    is_guest BOOLEAN DEFAULT FALSE
);

CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    departure_airport_id INT NOT NULL,
    arrival_airport_id INT NOT NULL,
    departure_date TIMESTAMPTZ NOT NULL,
    arrival_date TIMESTAMPTZ NOT NULL,
    total_seats INT NOT NULL DEFAULT 200,
    status VARCHAR(50) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (departure_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE,
    FOREIGN KEY (arrival_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE
);

CREATE TABLE airports (
    airport_id INT PRIMARY KEY,
    airport_code VARCHAR(3),
    airport_name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude NUMERIC(6, 3),
    longitude NUMERIC(6, 3),
    timezone NUMERIC(4,1)
);

-- This table will be pre-filled with psosible seat numbers
-- (1-24)(A-H)
CREATE TABLE seat_list (
    seat_id SERIAL PRIMARY KEY,
    seat_number VARCHAR(4) UNIQUE
);

-- If a row exists in this table it means that that seat has been
-- allready allocated and can't be taken by someone else
CREATE TABLE seat_allocation (
    flight_id INT,
    seat_id INT,
    PRIMARY KEY (flight_id, seat_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat_list(seat_id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_id INT NOT NULL,
    booking_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    total_price NUMERIC(10, 2) NOT NULL,
    discount_code VARCHAR(50),
    booking_status VARCHAR(50) NOT NULL,
    group_booking_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id, seat_id) REFERENCES seat_allocation(flight_id, seat_id) ON DELETE CASCADE,
    FOREIGN KEY (group_booking_id) REFERENCES group_bookings(group_booking_id) ON DELETE CASCADE
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE tickets (
    ticket_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    ticket_issued_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ticket_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE cancellations (
    cancellation_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    cancellation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPTZ,
    refund_amount DECIMAL(10, 2),
    cancellation_reason VARCHAR(255),
    refund_status VARCHAR(50),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE discounts (
    discount_code VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255),
    discount_percentage DECIMAL(5, 2),
    valid_from TIMESTAMPTZ,
    valid_to TIMESTAMPTZ,
    status VARCHAR(50)
);

CREATE TABLE group_bookings (
    group_booking_id SERIAL PRIMARY KEY,
    main_booking_id INT NOT NULL,
    group_size INT NOT NULL,
    group_discount DECIMAL(5, 2),
    FOREIGN KEY (main_booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE check_ins (
    checkin_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    checkin_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPTZ,
    boarding_pass_url VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMPTZ,
    report_data TEXT NOT NULL
);
