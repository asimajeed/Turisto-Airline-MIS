import React, { useEffect, useState } from "react";
import axios from "axios";

type BookingHistory = {
    user_id: number;
    booking_id: number;
    action_date: string;
    action_type: string;
};

const BookingHistoryPage: React.FC = () => {
    const [bookingHistories, setBookingHistories] = useState<BookingHistory[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);

    // Fetch Booking History from API
    useEffect(() => {
        const fetchBookingHistories = async () => {
            try {
                const response = await axios.get<BookingHistory[]>("/api/bookings-history");
                setBookingHistories(response.data);
            } catch (error) {
                console.error("Error fetching booking histories", error);
            }
        };

        fetchBookingHistories();
    }, []);

    // Handle selecting a booking
    const handleSelectBooking = (booking: BookingHistory) => {
        setSelectedBooking(booking);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Booking History</h1>
            {bookingHistories.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {bookingHistories.map((booking) => (
                        <li
                            key={booking.booking_id}
                            style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                            }}
                            onClick={() => handleSelectBooking(booking)}
                        >
                            <strong>Booking ID:</strong> {booking.booking_id} <br />
                            <strong>Action Date:</strong> {new Date(booking.action_date).toLocaleString()} <br />
                            <strong>Action Type:</strong> {booking.action_type}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No booking history found.</p>
            )}

            {selectedBooking && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Selected Booking Details</h2>
                    <p><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
                    <p><strong>User ID:</strong> {selectedBooking.user_id}</p>
                    <p><strong>Action Date:</strong> {new Date(selectedBooking.action_date).toLocaleString()}</p>
                    <p><strong>Action Type:</strong> {selectedBooking.action_type}</p>
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;
