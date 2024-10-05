CREATE DATABASE airline_ticketing_system

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

