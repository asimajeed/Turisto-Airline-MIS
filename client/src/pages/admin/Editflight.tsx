import React, { useState } from "react";
import axios, { Axios, AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditFlight: React.FC = () => {
  const [flightId, setFlightId] = useState<string>("");
  const [flight, setFlight] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element | null>(null);

  const [departureAirport, setDepartureAirport] = useState<string>("");
  const [arrivalAirport, setArrivalAirport] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [departureTime, setDepartureTime] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [totalSeats, setTotalSeats] = useState<number | string>("200");
  const [status, setStatus] = useState<string>("");
  const [customStatus, setCustomStatus] = useState<string>("");

  const handleFetchFlight = async () => {
    if (!flightId.trim()) return alert("Please enter a flight ID");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/flights/${flightId}`
      );
      if (response.data) {
        setFlight(response.data);
        setDepartureAirport(response.data.departure_airport_id);
        setArrivalAirport(response.data.arrival_airport_id);
        setPrice(response.data.base_price);
        setDepartureTime(
          new Date(response.data.departure_date).toISOString()
        );
        setArrivalTime(
          new Date(response.data.arrival_date).toISOString()
        );
        setTotalSeats(response.data.total_seats);
        setStatus("Other");
        setCustomStatus(response.data.status);
      } else {
        setFlight(null);
        setError("No flight corresponds to the provided flight ID.");
      }
    } catch (err: any) {
      setFlight(null);
      if (err instanceof AxiosError)
        setError(
          `${err.message}. Server message: ${err.response?.data.message}`
        );
      else setError(`Error fetching flight details. Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!flight) return alert("No flight to update.");
    // const userTimezoneOffset = new Date().getTimezoneOffset(); // Get the user's time zone offset in minutes
    // const formatToISOWithOffset = (date: string) => {
    //   const adjustedDate = new Date(date);
    //   adjustedDate.setMinutes(adjustedDate.getMinutes() + userTimezoneOffset);
    //   return adjustedDate.toISOString();
    // };
    // console.log( formatToISOWithOffset(arrivalTime))
    const updatedFlight = {
      ...flight,
      departure_airport_id: departureAirport,
      arrival_airport_id: arrivalAirport,
      base_price: price,
      departure_date: new Date(departureTime).toISOString(),
      arrival_date: new Date(arrivalTime).toISOString(),
      total_seats: totalSeats,
      status: status == "Other" ? customStatus : status,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/flights/${flightId}`,
        updatedFlight,
        {
          withCredentials: true,
        }
      );
      setError(<p className="text-green-500">Flight updated successfully!</p>);
    } catch (err) {
      if (err instanceof AxiosError)
        setError(
          `Failed to update the flight. ${err}. Response: ${err.response?.data.message}`
        );
      else setError("Failed to update the flight. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Flight</h1>

      <div className="space-y-4">
        <div>
          <Label className="block font-semibold mb-1">Flight ID</Label>
          <Input
            type="number"
            value={flightId}
            onChange={(e) => setFlightId(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <Button
            onClick={handleFetchFlight}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600"
          >
            {loading ? "Fetching..." : "Fetch Flight"}
          </Button>
        </div>

        {flight && (
          <>
            <div>
              <Label className="block font-semibold mb-1">Flight Number</Label>
              <Input
                type="text"
                value={flight.flight_number}
                readOnly
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">
                Departure Airport ID
              </Label>
              <Input
                type="text"
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">
                Arrival Airport ID
              </Label>
              <Input
                type="text"
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Base Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Departure Time</Label>
              <Input
                type="datetime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Arrival Time</Label>
              <Input
                type="datetime"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Total Seats</Label>
              <Input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border bg-card rounded-md px-3 py-2"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
                <option value="Other">Other</option>
              </select>

              {status === "Other" && (
                <Input
                  type="text"
                  value={customStatus}
                  onChange={(e) => {
                    setCustomStatus(e.target.value);
                  }}
                  placeholder="Enter custom status"
                  className="mt-2 w-full border rounded-md px-3 py-2"
                />
              )}
            </div>

            <div className="mt-4">
              <Button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </Button>
            </div>
          </>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default EditFlight;
