import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

const TicketGenerator = () => {
  const { bookingId } = useParams();
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided in the URL.");
      return;
    }

    const fetchTicketData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }/booking/ticket/${bookingId}`
        );
        const data = response.data;

        // Map the response data to match the ticket structure
        const mappedTicketData = {
          passenger: `${data.user.first_name} ${data.user.last_name}`,
          bookingReference: data.booking.booking_id, // Booking reference if applicable
          ticketNumber: `TUR-${data.ticket.ticket_id}`,
          flight: {
            flightNumber: data.flight.flight_number,
            route: `${data.flight.departure_airport.city} - ${data.flight.arrival_airport.city}`,
            departure: new Date(data.flight.departure_date).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            arrival: new Date(data.flight.arrival_date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date(data.flight.departure_date).toLocaleDateString([], {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          },
          totalPrice: `${data.booking.total_price} USD`, // Only showing total price
        };

        setTicketData(mappedTicketData);
      } catch (err) {
        if (err instanceof AxiosError)
          setError(
            "Failed to fetch ticket information. Please try again later. " +
              err.message +
              " " +
              err.response?.data.message
          );
        else
          setError(
            "Failed to fetch ticket information. Please try again later."
          );
      }
    };

    fetchTicketData();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!ticketData) {
    return <div className="loading-message">Loading ticket information...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen print:block">
      <div className="w-full max-w-2xl border border-gray-300 shadow-lg rounded-lg p-8 bg-card print:w-full print:max-w-none text-sm mt-10 mb-10">
        {/* Print Button */}
        <div className="text-right mb-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-foreground font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Print Ticket
          </button>
        </div>

        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Turisto Airlines
          </h1>
          <p className="text-sm">Electronic Ticket Itinerary and Receipt</p>
        </div>

        {/* Passenger Details */}
        <div className="mb-6">
          <p className="font-medium text-lg mb-1">
            Passenger: {ticketData.passenger}
          </p>
          <p>
            Booking Reference:{" "}
            <span className="font-semibold">{ticketData.bookingReference}</span>
          </p>
          <p>
            Ticket Number:{" "}
            <span className="font-semibold">{ticketData.ticketNumber}</span>
          </p>
        </div>

        {/* Flight Details */}
        <div className="border-b py-4">
          <p className="font-medium text-theme-primary mb-2">
            Flight: {ticketData.flight.flightNumber}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Route:</span>{" "}
              {ticketData.flight.route}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {ticketData.flight.date}
            </p>
            <p>
              <span className="font-semibold">Departure:</span>{" "}
              {ticketData.flight.departure} |{" "}
              <span className="font-semibold">Arrival:</span>{" "}
              {ticketData.flight.arrival}
            </p>
          </div>
        </div>

        {/* Fare Details */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-center font-semibold mb-2">Fare Details</h2>
          <div className="flex justify-between font-semibold mt-2">
            <span>Total Amount</span>
            <span>{ticketData.totalPrice}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t mt-4">
          <p className="text-xs text-foreground">
            Thank you for choosing Turisto Airlines!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator;
