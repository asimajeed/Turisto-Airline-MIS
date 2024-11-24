import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/context/GlobalStore";

export default function UpdateBooking() {
    const { email, is_guest, setEmail } = useGlobalStore();

    // State for individual fields
    const [bookingId, setBookingId] = useState("");
    const [flightNumber, setFlightNumber] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [status, setStatus] = useState("");

    // Handlers for individual updates
    const updateBookingField = (field: string, value: string | number | null) => {
        console.log(`Updating ${field}: ${value}`);
        alert(`${field} updated to: ${value}`);
        // Replace with API call to update the specific field
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Update Booking</h1>

            {/* Glass effect container */}
            <div className="bg-white/10 bg-opacity-50 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-6 space-y-6">

                {/* Booking ID */}
                <div>
                    <label htmlFor="booking-id" className="block text-sm font-medium">
                        Booking ID
                    </label>
                    <Input
                        id="booking-id"
                        type="text"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="Enter Booking ID to update fields"
                        required
                    />
                </div>

                {/* Flight Number */}
                <div>
                    <label htmlFor="flight-number" className="block text-sm font-medium">
                        Flight Number
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="flight-number"
                            type="text"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            placeholder="Enter new Flight Number"
                        />
                        <Button
                            onClick={() => updateBookingField("flight_number", flightNumber)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Seat Number */}
                <div>
                    <label htmlFor="seat-number" className="block text-sm font-medium">
                        Seat Number
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="seat-number"
                            type="text"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(e.target.value)}
                            placeholder="Enter new Seat Number"
                        />
                        <Button
                            onClick={() => updateBookingField("seat_number", seatNumber)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Booking Date */}
                <div>
                    <label htmlFor="booking-date" className="block text-sm font-medium">
                        Booking Date
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="booking-date"
                            type="datetime-local"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            placeholder="Select new Booking Date"
                        />
                        <Button
                            onClick={() => updateBookingField("booking_date", bookingDate)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Total Price */}
                <div>
                    <label htmlFor="total-price" className="block text-sm font-medium">
                        Total Price
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="total-price"
                            type="number"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            placeholder="Enter new Total Price"
                        />
                        <Button
                            onClick={() => updateBookingField("total_price", totalPrice)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Discount Code */}
                <div>
                    <label htmlFor="discount-code" className="block text-sm font-medium">
                        Discount Code
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="discount-code"
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter new Discount Code"
                        />
                        <Button
                            onClick={() => updateBookingField("discount_code", discountCode)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium">
                        Status
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="status"
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="Enter new Status"
                        />
                        <Button
                            onClick={() => updateBookingField("status", status)}
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* User Email */}
                {!is_guest && (
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-medium">
                            User Email
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="user-email"
                                type="email"
                                value={email || ""}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter new User Email"
                            />
                            <Button
                                onClick={() => updateBookingField("user_email", email)}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
