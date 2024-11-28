import { useGlobalStore } from "@/context/GlobalStore";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FC } from "react";

const Summary: FC = () => {
  const {
    selected_flight,
    departure_airport,
    arrival_airport,
    passengers,
    isOneWay,
  } = useGlobalStore();
  const numberOfPassengers = passengers.length + 1;

  const calculateDuration = (departure: Date, arrival: Date) => {
    const diffMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(diffMs / 36e5);
    const minutes = Math.round((diffMs % 36e5) / 6e4);
    return `${hours}h ${minutes}m`;
  };

  const flightDetails = selected_flight
    ? {
        flight_number: `${selected_flight.flight_number} ${
          departure_airport?.airport_code
        } to ${arrival_airport?.airport_code} ${
          isOneWay ? "-> One-way" : "<-> Round-trip"
        }`,
        duration: calculateDuration(
          selected_flight.departure_date,
          selected_flight.arrival_date
        ),
        departure_time: selected_flight.departure_date,
        arrival_time: selected_flight.arrival_date,
      }
    : {
        flight_number: "Not Selected",
        duration: "N/A",
        departure_time: null,
        arrival_time: null,
      };

  const basePrice = selected_flight?.base_price ?? 0;
  const subtotal = basePrice * numberOfPassengers;
  const taxesAndFees = subtotal * 0.16; // Assuming 16% tax
  const total = subtotal + taxesAndFees;

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-card p-4 border rounded-lg">
        <p>{flightDetails.flight_number}</p>
        <p>
          {flightDetails.duration} (
          {flightDetails.departure_time &&
            new Date(flightDetails.departure_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
          -{" "}
          {flightDetails.arrival_time &&
            new Date(flightDetails.arrival_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
          on{" "}
          {flightDetails.arrival_time &&
            new Date(flightDetails.arrival_time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          )
        </p>
      </div>

      {selected_flight ? (
        <>
          <div className="flex justify-between text-sm mt-6">
            <span>Subtotal ({numberOfPassengers} passengers)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes and Fees</span>
            <span>${taxesAndFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </>
      ) : (
        <p>Please select a flight to view details.</p>
      )}
    </div>
  );
};

export default Summary;
