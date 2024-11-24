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
  departureAirport: airportType;
  arrivalAirport: airportType;
  departureDate: Date;
  arrivalDate: Date;
  status: string;
  base_price: number;
}