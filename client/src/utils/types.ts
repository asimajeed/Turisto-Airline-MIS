export type airportType = {
  airport_id: number;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  timezone: number;
};

export interface Flight {
  flight_id: number;
  flight_number: string;
  departure_date: Date;
  arrival_date: Date;
  status: string;
  base_price: number;
}

export interface Booking {
  booking_id: number;
  user_id?: number;
  guest_user_id?: number;
  flight_number: string;
  seat_number: string;
  booking_date: string;
  total_price: number;
  discount_code?: string;
  status: string;
}

export type Passenger = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  seat: string;
};