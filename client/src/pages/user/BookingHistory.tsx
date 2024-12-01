import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type BookingHistory = {
  user_id: number;
  booking_id: number;
  action_date: string;
  action_type: string;
};

const BookingHistory: React.FC = () => {
  const [bookingHistories, setBookingHistories] = useState<BookingHistory[]>([
    { user_id: 12, booking_id: 123, action_date: "123", action_type: "123" },
  ]);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(
    null
  );

  // Fetch Booking History from API
  // useEffect(() => {
  //     const fetchBookingHistories = async () => {
  //         try {
  //             const response = await axios.get<BookingHistory[]>("/api/bookings-history");
  //             setBookingHistories(response.data);
  //         } catch (error) {
  //             console.error("Error fetching booking histories", error);
  //         }
  //     };

  //     fetchBookingHistories();
  // }, []);

  // Handle selecting a booking
  const handleSelectBooking = (booking: BookingHistory) => {
    setSelectedBooking(booking);
  };

  // Handle "Print Ticket" button click
  const handlePrintTicket = () => {
    if (selectedBooking) {
      alert(`Printing ticket for Booking ID: ${selectedBooking.booking_id}`);
      // You can replace this alert with actual print logic or redirect to a print page.
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl">Booking History</h1>
      <div className="p-3">
        <Table>
          <TableCaption>A list of your booking history.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Booking ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Action Date</TableHead>
              <TableHead>Action Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingHistories.map((booking) => (
              <TableRow
                key={booking.booking_id}
                onClick={() => handleSelectBooking(booking)}
                className={`cursor-pointer ${
                  selectedBooking?.booking_id === booking.booking_id
                    ? "bg-inherit text-muted-foreground"
                    : ""
                }`}
              >
                <TableCell className="font-medium">
                  {booking.booking_id}
                </TableCell>
                <TableCell>{booking.user_id}</TableCell>
                <TableCell>
                  {new Date(booking.action_date).toLocaleString()}
                </TableCell>
                <TableCell>{booking.action_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedBooking && (
        <div
          className="bg-card"
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Selected Booking Details</h2>
          <p>
            <strong>Booking ID:</strong> {selectedBooking.booking_id}
          </p>
          <p>
            <strong>User ID:</strong> {selectedBooking.user_id}
          </p>
          <p>
            <strong>Action Date:</strong>{" "}
            {new Date(selectedBooking.action_date).toLocaleString()}
          </p>
          <p>
            <strong>Action Type:</strong> {selectedBooking.action_type}
          </p>
          <div className="p-3">
            <Button
              onClick={handlePrintTicket}
              className="bg-theme-primary hover:bg-theme-primary-highlight text-white p-3"
            >
              Print Ticket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
