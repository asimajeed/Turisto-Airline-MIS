CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    date_of_birth DATE,
    loyalty_points INT DEFAULT 0,
    loyalty_points_redeemed INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    is_guest BOOLEAN DEFAULT FALSE
);

CREATE TABLE flights (
    flight_number VARCHAR(50) PRIMARY KEY,
    departure_airport VARCHAR(5) NOT NULL,
    arrival_airport VARCHAR(5) NOT NULL,
    departure_date DATETIME NOT NULL,
    arrival_date DATETIME NOT NULL,
    total_seats INT NOT NULL,
    status VARCHAR(50) NOT NULL
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


CREATE TABLE seats (
    flight_number VARCHAR(50),
    seat_number VARCHAR(10),
    PRIMARY KEY (flight_number, seat_number),
    FOREIGN KEY (flight_number) REFERENCES flights(flight_number) ON DELETE CASCADE
);

-- example: For a flight with flight_number 'AB123'
-- INSERT INTO seats (flight_number, seat_number) VALUES
-- ('AB123', '1A'), ('AB123', '1B'), ('AB123', '1C'), ..., ('AB123', '30C');


-- Booking is made by both guest user and signed in user
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, -- For registered users
    guest_user_id INT, -- For guest users
    flight_number VARCHAR(50) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10, 2) NOT NULL,
    discount_code VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_user_id) REFERENCES guest_users(guest_user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_number) REFERENCES flights(flight_number) ON DELETE CASCADE,
    FOREIGN KEY (seat_number) REFERENCES seats(seat_number) ON DELETE CASCADE
);

CREATE TABLE guest_users (
    guest_user_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);


CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    ticket_issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    ticket_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE booking_history (
    booking_history_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    booking_id INT NOT NULL,
    action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    action_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    cancellation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    refund_amount DECIMAL(10, 2),
    cancellation_reason VARCHAR(255),
    refund_status VARCHAR(50),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE discounts (
    discount_code VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255),
    discount_value DECIMAL(5, 2),
    valid_from DATETIME,
    valid_to DATETIME,
    status VARCHAR(50)
);

CREATE TABLE group_bookings (
    group_booking_id INT PRIMARY KEY AUTO_INCREMENT,
    main_booking_id INT NOT NULL,
    group_size INT NOT NULL,
    group_discount DECIMAL(5, 2),
    FOREIGN KEY (main_booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);


CREATE TABLE group_booking_guests (
    group_booking_id INT,
    guest_user_id INT,
    seat_number ,
    PRIMARY KEY (group_booking_id, guest_user_id),
    FOREIGN KEY (group_booking_id) REFERENCES group_bookings(group_booking_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_user_id) REFERENCES guest_users(guest_user_id) ON DELETE CASCADE
);

CREATE TABLE check_ins (
    checkin_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    checkin_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    boarding_pass_url VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(50) NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    report_data TEXT NOT NULL
);
