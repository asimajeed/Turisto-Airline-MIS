import { useGlobalStore } from "@/context/GlobalStore";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Flight, Pricing } from "@/utils/types";

const Summary: FC = () => {
  const {
    selected_flight,
    departure_airport,
    arrival_airport,
    passengers,
    isOneWay,
    returning_flight,
    discount_code,
    setTotalAmount
  } = useGlobalStore();
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState<string | null>(null);

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
        label !== "Return"
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

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        let discountValue = 0;
        let discountDetails = null;

        // Fetch discount details if a discount code is provided
        if (discount_code) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/discount`,
            {
              params: { discount_code },
            }
          );
          discountValue = response.data?.discount_percentage || 0;
          discountDetails = `Code: ${discount_code}`;
        }

        // Add 10% group discount if passengers > 1
        if (passengers.length > 0) {
          discountValue += 10;
          discountDetails = discountDetails
            ? `${discountDetails}, +10% Group Discount`
            : "+10% Group Discount";
        }

        setDiscount(discountValue);
        setDiscountReason(discountDetails);

        // Update pricing
        const pricing = new Pricing({
          base_price: outboundBasePrice + returnBasePrice,
          discount_percentage: discountValue,
          taxes: 0.16,
          discount_code,
        });
        setPricing(pricing);
        setTotalAmount(pricing.final_total);
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    };

    fetchDiscount();
  }, [discount_code, passengers, outboundBasePrice, returnBasePrice]);

  if (!pricing) {
    return <p>Loading pricing...</p>;
  }

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
            <span>${pricing.subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Discount ({discountReason})</span>
              <span>-${pricing.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Taxes and Fees (16%)</span>
            <span>${pricing.taxed_ammount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${pricing.final_total.toFixed(2)}</span>
          </div>
        </>
      ) : (
        <p>Please select a flight to view details.</p>
      )}
    </div>
  );
};

export default Summary;
