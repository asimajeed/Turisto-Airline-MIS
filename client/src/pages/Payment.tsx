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
import FullscreenSection from "@/components/FullscreenSection";
import { useGlobalStore } from "@/context/GlobalStore";

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit card");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Access GlobalStore
  const { selected_flight } = useGlobalStore();

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
        return 0.50;
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

  const handlePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowSummary(true);
    }, 5000); // 5 seconds delay before showing summary
  };

  const flightDetails = selected_flight
    ? {
      flight_number: selected_flight.flight_number,
      duration: `${Math.floor(
        (selected_flight.arrival_date.getTime() - selected_flight.departure_date.getTime()) / 36e5
      )}h ${Math.floor(
        ((selected_flight.arrival_date.getTime() - selected_flight.departure_date.getTime()) / 6e4) % 60
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
    <FullscreenSection>
      <div className="bg-card min-h-screen p-8 md:p-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {!showSummary ? (
            <>
              {/* Payment Form */}
              <div className="col-span-2 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-theme-primary-darker">
                  Payment Method
                </h2>
                <p className="text-sm text-foreground mt-1">
                  Select a payment method below. Tripma processes your payment securely with
                  end-to-end encryption.
                </p>

                {/* Payment Method Buttons */}
                <div className="flex space-x-4 mt-6">
                  {["Credit card", "Google Pay", "Apple Pay", "Paypal"].map((method) => (
                    <Button
                      key={method}
                      className={`${paymentMethod === method
                        ? "bg-theme-primary hover:bg-theme-primary-highlight text-white"
                        : "bg-theme-primary hover:bg-theme-primary-highlight text-white"
                        }`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>

                {/* Credit Card Details */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-theme-primary-darker">
                    Credit Card Details
                  </h3>
                  <div className="space-y-4 mt-6">
                    <Input placeholder="Name on card" />
                    <Input placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-6">
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
                  <Button className="mt-3" onClick={applyDiscount}>
                    Apply Discount
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              {/* Order Summary */}
              <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-theme-primary-darker">
                  Order Summary
                </h3>
                <div className="mt-6 space-y-6">
                  <div className="bg-card p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-theme-primary-darker">
                        {flightDetails.flight_number}
                      </p>
                      <p className="text-sm text-foreground">
                        {flightDetails.duration} - {flightDetails.departure_time} to{" "}
                        {flightDetails.arrival_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Base Price</span>
                    <span>${flightDetails.base_price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes and Fees</span>
                    <span>${(Number(flightDetails.base_price) * 0.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full bg-theme-primary hover:bg-theme-primary-highlight text-white mt-8 shadow-md"
                    onClick={handlePayment}
                  >
                    Confirm and Pay
                  </Button>
                </div>
              </div>

              {/* Payment Success Drawer */}
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
                        Thank you for your purchase. Your payment was processed successfully.
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
              <div className="col-span-3 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-theme-primary-darker">
                Your Trip Summary
              </h2>
              <div className="bg-card p-6 mt-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-theme-primary-darker">Flight Details</h3>
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
    </FullscreenSection>
  );
};

export default PaymentPage;
