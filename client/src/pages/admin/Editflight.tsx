import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditFlight: React.FC = () => {
  const [flightId, setFlightId] = useState<string>("");
  const [flight, setFlight] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [departureAirport, setDepartureAirport] = useState<string>("");
  const [arrivalAirport, setArrivalAirport] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [departureTime, setDepartureTime] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");

  const handleFetchFlight = async () => {
    if (!flightId.trim()) return alert("Please enter a flight ID");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/flight`,
        {
          params: {
            searchId: flightId,
          },
        }
      );
      console.log(response);
      if (response.data) {
        setFlight(response.data);
        setDepartureAirport(response.data.departure_airport_id);
        setArrivalAirport(response.data.arrival_airport_id);
        setPrice(response.data.base_price);
        setDepartureTime(
          new Date(response.data.departure_date).toISOString().slice(0, -1)
        ); // ISO format
        setArrivalTime(
          new Date(response.data.arrival_date).toISOString().slice(0, -1)
        );
      } else {
        setFlight(null);
        setError("No flight corresponds to the provided flight ID.");
      }
    } catch (err) {
      setFlight(null);
      setError("Error fetching flight details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!flight) return alert("No flight to update.");
    const updatedFlight = {
      ...flight,
      flight_number: 1,
      departure_airport_id: departureAirport,
      arrival_airport_id: arrivalAirport,
      base_price: price,
      departure_date: new Date(departureTime).toISOString(),
      arrival_date: new Date(arrivalTime).toISOString(),
    };

    try {
      await axios.put(`/api/flight/${flightId}`, updatedFlight);
      alert("Flight updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to update the flight. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Flight</h1>

      <div className="space-y-4">
        {/* Flight ID Input */}
        <div>
          <Label className="block font-semibold mb-1">Flight ID</Label>
          <Input
            type="text"
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

        {error && <div className="text-red-500">{error}</div>}

        {/* Flight Details */}
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
                Departure Airport
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
                Arrival Airport
              </Label>
              <Input
                type="text"
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Price</Label>
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
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <Label className="block font-semibold mb-1">Arrival Time</Label>
              <Input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
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
      </div>
    </div>
  );
};

export default EditFlight;
