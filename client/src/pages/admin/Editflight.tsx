import React, { useState, useEffect } from "react";
import { useGlobalStore } from "@/context/GlobalStore";
import { airportType, Flight } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditFlight: React.FC = () => {
    const { selected_flight, setSelectedFlight } = useGlobalStore();

    const [flight, setFlight] = useState<Flight | null>(null);
    const [departureAirport, setDepartureAirportLocal] = useState<airportType | null>(null);
    const [arrivalAirport, setArrivalAirportLocal] = useState<airportType | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [departureTime, setDepartureTime] = useState<string>("");
    const [arrivalTime, setArrivalTime] = useState<string>("");

    useEffect(() => {
        if (selected_flight) {
            setFlight(selected_flight);
            setDepartureAirportLocal(selected_flight.departureAirport);
            setArrivalAirportLocal(selected_flight.arrivalAirport);
            setPrice(selected_flight.base_price);
            setDepartureTime(selected_flight.departureDate.toISOString());
            setArrivalTime(selected_flight.arrivalDate.toISOString());
        }
    }, [selected_flight]);

    const handleSave = () => {
        if (!flight || !departureAirport || !arrivalAirport) return;

        const updatedFlight: Flight = {
            ...flight,
            departureAirport,
            arrivalAirport,
            base_price: price || flight.base_price,
            departureDate: new Date(departureTime),
            arrivalDate: new Date(arrivalTime),
        };

        setSelectedFlight(updatedFlight);
        alert("Flight updated successfully!");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Flight</h1>
            <div className="space-y-4">
                {/* Departure Airport */}
                <div>
                    <Label className="block font-semibold mb-1">Departure Airport</Label>
                    <Input
                        type="text"
                        value={departureAirport?.airport_name || ""}
                        onChange={(e) =>
                            setDepartureAirportLocal({
                                ...departureAirport,
                                airport_name: e.target.value,
                                airport_id: departureAirport?.airport_id || 0, // Provide a default valid ID
                                airport_code: departureAirport?.airport_code || "", // Default to empty string
                            })
                        }
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Arrival Airport */}
                <div>
                    <Label className="block font-semibold mb-1">Arrival Airport</Label>
                    <Input
                        type="text"
                        value={arrivalAirport?.airport_name || ""}
                        onChange={(e) =>
                            setArrivalAirportLocal({
                                ...arrivalAirport,
                                airport_name: e.target.value,
                                airport_id: arrivalAirport?.airport_id || 0, // Provide a default valid ID
                                airport_code: arrivalAirport?.airport_code || "", // Default to empty string
                            })
                        }
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Price */}
                <div>
                    <Label className="block font-semibold mb-1">Price</Label>
                    <Input
                        type="number"
                        value={price || ""}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Departure Time */}
                <div>
                    <Label className="block font-semibold mb-1">Departure Time</Label>
                    <Input
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Arrival Time */}
                <div>
                    <Label className="block font-semibold mb-1">Arrival Time</Label>
                    <Input
                        type="datetime-local"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Save Button */}
                <div className="mt-4">
                    <Button
                        onClick={handleSave}
                        className="bg-blue-500 text-foreground px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditFlight;
