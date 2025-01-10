import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Summary from "@/components/Summary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SeatSelection from "../components/SeatSelection/SeatSelection";
import { useGlobalStore } from "@/context/GlobalStore";
import { Passenger } from "@/utils/types";
import MapComponent from "@/components/Map";

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
    selectedSeat,
    setSelectedSeat,
    returningSeat,
    setReturningSeat,
    date_of_birth,
    setDateOfBirth,
    passengers: groupPassengers,
    setPassengers: setGroupPassengers,
    isOneWay,
    selected_flight,
    returning_flight,
  } = useGlobalStore();

  const addPassenger = () => {
    setGroupPassengers([
      ...groupPassengers,
      {
        first_name: "",
        last_name: "",
        date_of_birth: "",
        email: "",
        seat: "",
        returningSeat: "",
      },
    ]);
  };

  const removePassenger = () => {
    if (groupPassengers.length == 1) setGroupPassengers([]);
    else {
      groupPassengers.pop();
      setGroupPassengers(groupPassengers);
    }
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

  return (
    <MapComponent className="h-full">
      <div className="container mx-auto mt-24">
        <div>
          {/* Passenger Information Section */}
          <div>
            <h2 className="text-lg font-bold text-theme-primary-darker">
              Passenger Information
            </h2>
            <p className="text-sm text-gray-500">
              Enter the required information for each traveler and ensure it
              matches the government-issued ID.
            </p>

            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Passenger 1 (Adult)</h3>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="First name*"
                  value={first_name || ""}
                  type="text"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  placeholder="Last name*"
                  value={last_name || ""}
                  required
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Date of birth*"
                  type="date"
                  value={
                    date_of_birth
                      ? date_of_birth.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setDateOfBirth(new Date(e.target.value + "T00:00:00Z"));
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Email address*"
                  value={email || ""}
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Phone number*"
                  value={phone_number || ""}
                  type="tel"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <SeatSelection
                selectedSeat={selectedSeat}
                setSelectedSeat={setSelectedSeat}
                selectedFlight={selected_flight}
              />
              <p>Seat: {selectedSeat}</p>
              {!isOneWay && (
                <>
                  <SeatSelection
                    selectedSeat={returningSeat}
                    setSelectedSeat={setReturningSeat}
                    selectedFlight={returning_flight}
                  />
                  <p>Returning Seat: {returningSeat}</p>
                </>
              )}
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
                    required
                    onChange={(e) =>
                      updatePassenger(index, "first_name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Last name*"
                    value={passenger.last_name}
                    required
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
                    required
                    onChange={(e) =>
                      updatePassenger(index, "email", e.target.value)
                    }
                  />
                </div>
                <SeatSelection
                  selectedSeat={passenger.seat}
                  setSelectedSeat={(s: string) => {
                    groupPassengers[index].seat = s;
                    setGroupPassengers(groupPassengers);
                  }}
                  selectedFlight={selected_flight}
                />
                <p>Seat: {passenger.seat}</p>
                {!isOneWay && (
                  <>
                    <SeatSelection
                      selectedSeat={passenger.returningSeat}
                      setSelectedSeat={(s: string) => {
                        groupPassengers[index].returningSeat = s;
                        setGroupPassengers(groupPassengers);
                      }}
                      selectedFlight={returning_flight}
                    />
                    <p>Seat: {passenger.returningSeat}</p>
                  </>
                )}
              </div>
            ))}
            <div className="mt-4">
              <Button
                className="bg-theme-primary hover:bg-theme-primary-highlight text-white"
                onClick={addPassenger}
              >
                Add Another Passenger
              </Button>
              {groupPassengers.length >= 1 ? (
                <Button
                  variant="destructive"
                  onClick={removePassenger}
                  className="ml-2"
                >
                  Remove A Passenger
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mt-6">Bag Information</h3>
            <p className="text-sm text-gray-500">
              Each passenger is allowed one free carry-on bag and one personal
              item.
            </p>

            <div className="flex space-x-4 mt-6">
              <Sheet>
                <SheetTrigger asChild>
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
                  {/* Summary Section here */}
                  <Summary />
                  <Link to="/payment">
                    <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-foreground m-3">
                      Pay
                    </Button>
                  </Link>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </MapComponent>
  );
};

export default PassengerInfo;
