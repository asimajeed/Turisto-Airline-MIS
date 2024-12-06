import SeatSelection from "@/components/SeatSelection/SeatSelection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export function ModifyFlight() {
  const [bookingId, setBookingId] = useState<number>();
  const [flight, setFlight] = useState<any | null>(null);
  const [seatNum, setSeatNum] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFlightDetails = async () => {
    if (!bookingId) {
      alert("Please enter a valid booking ID.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/booking/${bookingId}`
      );
      setFlight({ flight_id: response.data.flight_id }); // Assuming response includes flight_id and other flight details.
    } catch (error: any) {
      console.error("Error fetching flight details:", error);
      alert(error.response?.data?.message || "Failed to fetch flight details.");
      setFlight(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!bookingId || !seatNum || !flight) {
      alert("Please ensure all fields are filled out.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/bookings/modify", {
        booking_id: bookingId,
        flight_id: flight.flight_id,
        new_seat: seatNum,
      });

      alert("Your seat has been updated successfully.");
    } catch (error: any) {
      console.error("Error modifying booking:", error);
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br text-foreground min-h-screen">
      {/* Header */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h1 className="text-2xl font-semibold text-foreground">
          Modify Booking
        </h1>
        <p className="text-sm text-foreground/70">
          Update your flight booking details here.
        </p>
      </div>

      {/* Flight Details Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground">
          Flight Details
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="booking-reference"
              className="block text-sm font-medium text-foreground/70"
            >
              Booking Reference
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="booking-reference"
                type="number"
                placeholder="Enter your booking reference"
                value={bookingId}
                onChange={(e) =>
                  setBookingId(Number(e.target.value || undefined))
                }
                className="text-foreground placeholder-white/70 border border-white/20"
              />
              <Button
                variant="outline"
                onClick={fetchFlightDetails}
                disabled={loading}
              >
                {loading ? "Loading..." : "Fetch Details"}
              </Button>
            </div>
          </div>
        </div>
        {flight && (
          <div className="mt-4">
            <p>Flight Number: {flight.flight_id}</p>
          </div>
        )}
      </div>

      {/* Modification Options Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground">
          Modification Options
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label className="block text-sm font-medium text-foreground/70">
              Change Seat Preference: {seatNum}
            </Label>
            <div className="mt-4 flex gap-4">
              <Input
                type="text"
                value={seatNum}
                onChange={(e) => {
                  setSeatNum(e.target.value);
                }}
              ></Input>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Actions Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground">Save Changes</h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-foreground/70">
            Review your changes before proceeding. Charges may apply for
            modifications.
          </p>
        </div>
        <div className="mt-4 flex gap-4">
          <Button
            variant="outline"
            onClick={handleSaveChanges}
            disabled={loading}
            className="text-foreground"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            className="text-foreground"
            onClick={() => {
              setBookingId(undefined);
              setFlight(null);
              setSeatNum("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
