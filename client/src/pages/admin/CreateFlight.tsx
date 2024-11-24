import { useState } from "react";
import { useGlobalStore } from "@/context/GlobalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateFlight = () => {
    const { departure_airport, arrival_airport, airport_list } = useGlobalStore();

    const [flightNumber, setFlightNumber] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");
    const [totalSeats, setTotalSeats] = useState(0);
    const [status, setStatus] = useState("Active");
    const [basePrice, setBasePrice] = useState(0);

    const handleSubmit = () => {
        // Make sure airports are selected
        if (!departure_airport || !arrival_airport) {
            alert("Please select both departure and arrival airports.");
        }

        // Handle the flight creation logic here
        const newFlight = {
            flight_number: flightNumber,
            departure_airport_id: departure_airport, // Assuming airport has an 'id'
            arrival_airport_id: arrival_airport,
            departure_date: departureDate,
            arrival_date: arrivalDate,
            total_seats: totalSeats,
            status: status,
            base_price: basePrice,
        };

        // Call API to create the flight (replace with your API logic)
        console.log("Flight created:", newFlight);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create Flight</h2>

            <div className="mb-4">
                <Label htmlFor="flightNumber" className="block text-sm font-medium text-foreground">
                    Flight Number
                </Label>
                <Input
                    type="text"
                    id="flightNumber"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="departureAirport" className="block text-sm font-medium text-foreground">
                    Departure Airport
                </Label>
                <select
                    id="departureAirport"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    onChange={(e) => setDepartureDate(e.target.value)}
                >
                    <option value="">Select Departure Airport</option>
                    {airport_list?.map((airport) => (
                        <option key={airport} value={airport}>
                            {airport}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <Label htmlFor="arrivalAirport" className="block text-sm font-medium text-foreground">
                    Arrival Airport
                </Label>
                <select
                    id="arrivalAirport"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    onChange={(e) => setArrivalDate(e.target.value)}
                >
                    <option value="">Select Arrival Airport</option>
                    {airport_list?.map((airport) => (
                        <option key={airport} value={airport}>
                            {airport}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <Label htmlFor="departureDate" className="block text-sm font-medium text-foreground">
                    Departure Date
                </Label>
                <Input
                    type="datetime-local"
                    id="departureDate"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="arrivalDate" className="block text-sm font-medium text-foreground">
                    Arrival Date
                </Label>
                <Input
                    type="datetime-local"
                    id="arrivalDate"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="totalSeats" className="block text-sm font-medium text-foreground">
                    Total Seats
                </Label>
                <Input
                    type="number"
                    id="totalSeats"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="basePrice" className="block text-sm font-medium text-foreground">
                    Base Price
                </Label>
                <Input
                    type="number"
                    id="basePrice"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="status" className="block text-sm font-medium text-foreground">
                    Status
                </Label>
                <select
                    id="status"
                    className="mt-1 block w-full p-2 border rounded bg-card"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <Button
                onClick={handleSubmit}
                className="bg-blue-500 text-foreground px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Create Flight
            </Button>
        </div>
    );
};

export default CreateFlight;
