import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/context/GlobalStore";
import { Label } from "@/components/ui/label";

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
            <h1 className="text-2xl font-bold text-foreground">Update Booking</h1>

            {/* Glass effect container */}
            <div className="bg-card bg-opacity-50 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-6 space-y-6">

                {/* Booking ID */}
                <div>
                    <Label htmlFor="booking-id" className="block text-sm font-medium text-foreground">
                        Booking ID
                    </Label>
                    <Input
                        id="booking-id"
                        type="text"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="Enter Booking ID to update fields"
                        required
                        className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                    />
                </div>

                {/* Flight Number */}
                <div>
                    <Label htmlFor="flight-number" className="block text-sm font-medium text-foreground">
                        Flight Number
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="flight-number"
                            type="text"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            placeholder="Enter new Flight Number"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("flight_number", flightNumber)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Seat Number */}
                <div>
                    <Label htmlFor="seat-number" className="block text-sm font-medium text-foreground">
                        Seat Number
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="seat-number"
                            type="text"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(e.target.value)}
                            placeholder="Enter new Seat Number"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("seat_number", seatNumber)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Booking Date */}
                <div>
                    <Label htmlFor="booking-date" className="block text-sm font-medium text-foreground">
                        Booking Date
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="booking-date"
                            type="datetime-local"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            placeholder="Select new Booking Date"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("booking_date", bookingDate)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Total Price */}
                <div>
                    <Label htmlFor="total-price" className="block text-sm font-medium text-foreground">
                        Total Price
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="total-price"
                            type="number"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            placeholder="Enter new Total Price"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("total_price", totalPrice)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Discount Code */}
                <div>
                    <Label htmlFor="discount-code" className="block text-sm font-medium text-foreground">
                        Discount Code
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="discount-code"
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter new Discount Code"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("discount_code", discountCode)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <Label htmlFor="status" className="block text-sm font-medium text-foreground">
                        Status
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="status"
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="Enter new Status"
                            className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        />
                        <Button
                            onClick={() => updateBookingField("status", status)}
                            className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
                        >
                            Update
                        </Button>
                    </div>
                </div>

                {/* User Email */}
                {!is_guest && (
                    <div>
                        <Label htmlFor="user-email" className="block text-sm font-medium text-foreground">
                            User Email
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="user-email"
                                type="email"
                                value={email || ""}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter new User Email"
                                className="border border-white/20 text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                            />
                            <Button
                                onClick={() => updateBookingField("user_email", email)}
                                className="w-32 bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg"
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
