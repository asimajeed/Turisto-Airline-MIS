import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "@/assets/worldmap.png"; // Replace with correct path
import FullscreenSection from "@/components/FullscreenSection";
import SeatSelection from "../components/SeatSelection/SeatSelection";
import { useGlobalStore } from "@/context/GlobalStore";
import { useState } from "react";

type Passenger = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
};

const PassengerInfo = () => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    selected_flight, 
  } = useGlobalStore();

  const [groupPassengers, setGroupPassengers] = useState<Passenger[]>([
    { first_name: "", last_name: "", date_of_birth: "", email: "" },
  ]);

  const addPassenger = () => {
    setGroupPassengers([
      ...groupPassengers,
      { first_name: "", last_name: "", date_of_birth: "", email: "" },
    ]);
  };

  const updatePassenger = (
    index: number,
    key: keyof Passenger, 
    value: string
  ) => {
    const updatedPassengers = [...groupPassengers];
    updatedPassengers[index][key] = value;
    setGroupPassengers(updatedPassengers);
  };

  const flightDetails = selected_flight
    ? {
      flight_number: selected_flight.flight_number,
      duration: selected_flight.duration,
      departure_time: selected_flight.departure_time,
      arrival_time: selected_flight.arrival_time,
    }
    : {
      flight_number: "Not Selected",
      duration: "N/A",
      departure_time: "N/A",
      arrival_time: "N/A",
    };

  return (
    <FullscreenSection>
      <div
        className="bg-inherit bg-cover bg-center bg-no-repeat h-full p-8 md:p-16"
        style={{
          backgroundImage: `url(${Image})`,
          backgroundBlendMode: "exclusion",
        }}
      >
        <div className="container mx-auto p-6">
          <div>
            {/* Passenger Information Section */}
            <div>
              <h2 className="text-lg font-bold text-theme-primary-darker">
                Passenger Information
              </h2>
              <p className="text-sm text-gray-500">
                Enter the required information for each traveler and ensure it matches the
                government-issued ID.
              </p>

              <div className="mt-4 space-y-4">
                <h3 className="font-medium">Passenger 1 (Adult)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="First name*"
                    value={first_name || ""}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="Last name*"
                    value={last_name || ""}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="Date of birth*" type="date" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Email address*"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Phone number*"
                    value={phone_number || ""}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Group Booking Section */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-theme-primary-darker">
                Group Booking
              </h2>
              <p className="text-sm text-gray-500">
                Add details for additional passengers in your group.
              </p>
              {groupPassengers.map((passenger, index) => (
                <div key={index} className="mt-4 space-y-4 border-t pt-4">
                  <h3 className="font-medium">Passenger {index + 2}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="First name*"
                      value={passenger.first_name}
                      onChange={(e) =>
                        updatePassenger(index, "first_name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Last name*"
                      value={passenger.last_name}
                      onChange={(e) =>
                        updatePassenger(index, "last_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Date of birth*"
                      type="date"
                      value={passenger.date_of_birth}
                      onChange={(e) =>
                        updatePassenger(index, "date_of_birth", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Email address*"
                      value={passenger.email}
                      onChange={(e) =>
                        updatePassenger(index, "email", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Button
                  className="bg-theme-primary hover:bg-theme-primary-highlight text-white"
                  onClick={addPassenger}
                >
                  Add Another Passenger
                </Button>
              </div>
            </div>

            {/* Bag Information and Summary Section */}
            <div className="mt-8">
              <h3 className="font-medium mt-6">Bag Information</h3>
              <p className="text-sm text-gray-500">
                Each passenger is allowed one free carry-on bag and one personal item.
              </p>

              <div className="flex space-x-4 mt-6">
                <Sheet>
                  <SheetTrigger>
                    <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white">
                      View Summary
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Flight Summary</SheetTitle>
                      <SheetDescription>
                        Review your flight details and total costs.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <div className="bg-card p-4 border rounded-lg">
                        <p>{flightDetails.flight_number}</p>
                        <p>{flightDetails.duration} ({flightDetails.departure_time} to {flightDetails.arrival_time})</p>
                      </div>

                      <div className="flex justify-between text-sm mt-6">
                        <span>Subtotal</span>
                        <span>$503</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes and Fees</span>
                        <span>$121</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>$624</span>
                      </div>
                      <SeatSelection />
                      <Link to="/payment">
                        <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-foreground m-3">
                          Pay
                        </Button>
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
};

export default PassengerInfo;
