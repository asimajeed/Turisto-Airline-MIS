import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit card");

  const handlePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowSummary(true);
    }, 10000); // 10 seconds delay before showing summary
  };

  return (
    <FullscreenSection>
      <div className="bg-card min-h-screen p-8 md:p-16 ">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {/* Conditional Rendering for Summary or Payment Form */}
          {!showSummary ? (
            <>
              {/* Left Side - Payment Form */}
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
                      className={
                        paymentMethod === method
                          ? "bg-theme-primary hover:bg-theme-primary-highlight text-white"
                          : "bg-theme-primary hover:bg-theme-primary-highlight text-white"
                      }
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>

                {/* Credit Card Details */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-theme-primary-darker">Credit Card Details</h3>
                  <div className="flex items-center space-x-2 mt-4">
                    <input type="checkbox" id="billingSameAsPassenger" />
                    <label htmlFor="billingSameAsPassenger" className="text-sm text-foreground">
                      Billing address is the same as Passenger 1
                    </label>
                  </div>
                  <div className="space-y-4 mt-6">
                    <Input placeholder="Name on card" />
                    <Input placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-6">
                      <Input placeholder="Expiration date (MM/YY)" />
                      <Input placeholder="CCV" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-theme-primary-darker">Order Summary</h3>
                <div className="mt-6 space-y-6">
                  {/* Flight Information */}
                  <div className="bg-card p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-theme-primary-darker">Hawaiian Airlines - FIG4312</p>
                      <p className="text-sm text-foreground">16h 45m (+1d) - 7:00 AM to 4:15 PM</p>
                    </div>
                    <div className="text-sm text-foreground">2h 45m in HNL</div>
                  </div>

                  {/* Price Details */}
                  <div className="flex justify-between text-sm mt-4">
                    <span>Seat upgrade</span>
                    <span>$199</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$702</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes and Fees</span>
                    <span>$66</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span>$768</span>
                  </div>

                  {/* Confirm and Pay Button */}
                  <Button
                    className="w-full bg-theme-primary hover:bg-theme-primary-highlight text-white mt-8 shadow-md"
                    onClick={handlePayment}
                  >
                    Confirm and Pay
                  </Button>
                  <Drawer open={paymentSuccess}>
                    <DrawerContent>
                      <DrawerHeader>
                        {/* Animated Payment Success Message */}
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
                </div>
              </div>
            </>
          ) : (
            // Summary Screen Content
              <div className="col-span-3 bg-card p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-theme-primary-darker">Your Trip Summary</h2>
              <p className="text-foreground mt-4">
                Your flight has been booked successfully! Below is a summary of your trip.
              </p>
              <div className="bg-card p-6 mt-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-theme-primary-darker">Flight Details</h3>
                <p className="text-foreground mt-2">Departure: February 25th, 2021</p>
                <p className="text-foreground">Arrival: March 21st, 2021</p>
                <p className="text-foreground mt-4">Hawaiian Airlines - FIG4312</p>
                <p className="text-foreground">16h 45m (+1d) - 7:00 AM to 4:15 PM</p>
                <p className="text-foreground mt-4 font-bold">Total Paid: $768</p>
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
