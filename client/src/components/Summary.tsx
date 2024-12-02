import { useGlobalStore } from "@/context/GlobalStore";
import { FC } from "react";
import { Flight, Pricing } from "@/utils/types";

const Summary: FC = () => {
  const {
    selected_flight,
    departure_airport,
    arrival_airport,
    passengers,
    isOneWay,
    returning_flight,
  } = useGlobalStore();
  const numberOfPassengers = passengers.length + 1;

  const calculateDuration = (departure: Date, arrival: Date) => {
    const diffMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(diffMs / 36e5);
    const minutes = Math.round((diffMs % 36e5) / 6e4);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const flightDetails = (flight: Flight | null, label: string) => {
    if (!flight) {
      return {
        label,
        flight_number: "Not Selected",
        duration: "N/A",
        departure_time: null,
        arrival_time: null,
      };
    }
    return {
      label,
      flight_number:
        label != "Return"
          ? `${flight.flight_number} ${departure_airport?.airport_code} to ${arrival_airport?.airport_code}`
          : `${flight.flight_number} ${arrival_airport?.airport_code} to ${departure_airport?.airport_code}`,
      duration: calculateDuration(flight.departure_date, flight.arrival_date),
      departure_time: flight.departure_date,
      arrival_time: flight.arrival_date,
    };
  };

  const outboundFlight = flightDetails(
    selected_flight,
    isOneWay ? "One-way" : "Outbound"
  );
  const returnFlight = !isOneWay
    ? flightDetails(returning_flight, "Return")
    : null;

  const outboundBasePrice = selected_flight?.base_price ?? 0;
  const returnBasePrice = returning_flight?.base_price ?? 0;
  const pricing = new Pricing({
    base_price: outboundBasePrice + returnBasePrice,
    taxes: 0.16,
  });
  const subtotal = pricing.subtotal;
  const taxesAndFees = pricing.taxed_ammount; // Assuming 16% tax
  const total = pricing.final_total;

  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-semibold text-lg">Flight Details</h3>
      <div className="bg-card p-4 border rounded-lg">
        <p>{outboundFlight.label}</p>
        <p className="font-medium">{outboundFlight.flight_number}</p>
        <p>
          {outboundFlight.duration} (
          {outboundFlight.departure_time &&
            `${formatTime(new Date(outboundFlight.departure_time))} - 
            ${formatTime(new Date(outboundFlight.arrival_time))} on 
            ${formatDate(new Date(outboundFlight.arrival_time))}`}
          )
        </p>
      </div>

      {returnFlight && (
        <div className="bg-card p-4 border rounded-lg">
          <p>{returnFlight.label}</p>
          <p className="font-medium">{returnFlight.flight_number}</p>
          <p>
            {returnFlight.duration} (
            {returnFlight.departure_time &&
              `${formatTime(new Date(returnFlight.departure_time))} - 
              ${formatTime(new Date(returnFlight.arrival_time))} on 
              ${formatDate(new Date(returnFlight.arrival_time))}`}
            )
          </p>
        </div>
      )}

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
