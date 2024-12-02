import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Link } from "react-router-dom";
import { useGlobalStore } from "@/context/GlobalStore";
import axios, { AxiosError } from "axios";
import { Passenger } from "@/utils/types";
import Summary from "@/components/Summary";

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit card");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Access GlobalStore
  const {
    selected_flight,
    isLoggedIn,
    first_name,
    last_name,
    email,
    phone_number,
    selectedSeat,
    passengers,
  } = useGlobalStore();
  // Update totalPrice whenever the discount is applied
  useEffect(() => {
    if (selected_flight) {
      const basePrice = selected_flight.base_price;
      const taxes = basePrice * 0.16;
      const discountedPrice = discountApplied
        ? basePrice * (1 - getDiscountPercentage(discountCode))
        : basePrice;

      setTotalPrice(parseFloat((discountedPrice + taxes).toFixed(2)));
    }
  }, [discountApplied, selected_flight]);

  // Helper function to get discount percentage
  const getDiscountPercentage = (code: string): number => {
    switch (code.toUpperCase()) {
      case "TUR25":
        return 0.25;
      case "TUR50":
        return 0.5;
      case "TUR75":
        return 0.75;
      default:
        return 0;
    }
  };

  const applyDiscount = () => {
    const discountPercentage = getDiscountPercentage(discountCode);
    if (discountPercentage > 0) {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code.");
      setDiscountApplied(false);
    }
  };

  const handlePayment = async () => {
    if (!selected_flight || !selectedSeat)
      return alert("Incomplete information");
    let data: {
      flight_id: number;
      seat_number: string;
      total_price: number;
      discountCode: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      passengers?: Array<Passenger>;
    } = {
      flight_id: selected_flight.flight_id,
      seat_number: selectedSeat,
      total_price: totalPrice,
      discountCode,
    };
    if (!isLoggedIn && first_name && last_name && email) {
      data = {
        ...data,
        first_name,
        last_name,
        email,
        phone_number: phone_number || undefined,
      };
    }
    if (passengers.length > 0) data.passengers = passengers;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/booking/create`,
        data,
        {
          withCredentials: true,
        }
      );
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowSummary(true);
      }, 5000); // 5 seconds delay before showing summary
    } catch (error) {
      if (error instanceof AxiosError)
        alert(`${error} ${error.response?.data.message}`);
      else
        alert(`Error ${error}`)
    }
  };

  const flightDetails = selected_flight
    ? {
        flight_number: selected_flight.flight_number,
        duration: `${Math.floor(
          (selected_flight.arrival_date.getTime() -
            selected_flight.departure_date.getTime()) /
            36e5
        )}h ${Math.floor(
          ((selected_flight.arrival_date.getTime() -
            selected_flight.departure_date.getTime()) /
            6e4) %
            60
        )}m`,
        departure_time: selected_flight.departure_date.toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrival_time: selected_flight.arrival_date.toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        base_price: selected_flight.base_price.toFixed(2),
      }
    : {
        flight_number: "Not Selected",
        duration: "N/A",
        departure_time: "N/A",
        arrival_time: "N/A",
        base_price: "0.00",
      };

  return (
    <div className="bg-card min-h-screen p-4 md:p-8 pt-20">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {!showSummary ? (
          <>
            <div className="col-span-1 md:col-span-2 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl md:text-2xl font-semibold text-theme-primary-darker">
                Payment Method
              </h2>
              <p className="text-sm md:text-base text-foreground mt-1">
                Select a payment method below. Tripma processes your payment
                securely with end-to-end encryption.
              </p>

              <div className="flex flex-wrap justify-evenly xl:max-w-64 mt-4justify-center">
                {["Credit card", "Google Pay", "Apple Pay", "Paypal"].map(
                  (method) => (
                    <Button
                      key={method}
                      className={`${
                        paymentMethod === method
                          ? "bg-theme-primary opacity-70 hover:bg-theme-primary-highlight text-white"
                          : "bg-theme-primary hover:bg-theme-primary-highlight text-white"
                      } w-full sm:w-auto mx-4 mt-2`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  )
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-theme-primary-darker">
                  Credit Card Details
                </h3>
                <div className="space-y-4 mt-6">
                  <Input placeholder="Name on card" />
                  <Input placeholder="Card number" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input placeholder="Expiration date (MM/YY)" />
                    <Input placeholder="CCV" />
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-theme-primary-darker">
                  Discount Code
                </h3>
                <Input
                  placeholder="Enter Discount Code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button
                  className="mt-3 w-full sm:w-auto"
                  onClick={applyDiscount}
                >
                  Apply Discount
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-theme-primary-darker">
                Order Summary
              </h3>
              <Summary />
              <Button
                className="w-full bg-theme-primary hover:bg-theme-primary-highlight text-white mt-8 shadow-md"
                onClick={handlePayment}
              >
                Confirm and Pay
              </Button>
            </div>

            <Drawer open={paymentSuccess}>
              <DrawerContent>
                <DrawerHeader>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-center mt-4"
                  >
                    <DrawerTitle className="text-green-600 text-4xl font-bold">
                      Payment Successful!
                    </DrawerTitle>
                    <DrawerDescription className="text-foreground mt-2">
                      Thank you for your purchase. Your payment was processed
                      successfully.
                    </DrawerDescription>
                  </motion.div>
                </DrawerHeader>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          // Summary Screen Content
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-theme-primary-darker">
              Your Trip Summary
            </h2>
            <div className="bg-card p-6 mt-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-theme-primary-darker">
                Flight Details
              </h3>
              <p className="text-foreground mt-2">
                Departure: {flightDetails.departure_time}
              </p>
              <p className="text-foreground">
                Arrival: {flightDetails.arrival_time}
              </p>
              <p className="text-foreground mt-4 font-bold">
                Total Paid: ${totalPrice.toFixed(2)}
              </p>
            </div>
            <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white m-4 shadow-md">
              <Link to="/boardingpass">Boarding Pass</Link>
            </Button>

            <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white m-4 shadow-md">
              <Link to="/passengerticket">Ticket</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
