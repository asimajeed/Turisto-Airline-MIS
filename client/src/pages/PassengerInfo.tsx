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

const PassengerInfo = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Side - Form Section */}
        <div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-500 text-transparent bg-clip-text">Passenger information</h2>
          <p className="text-sm text-gray-500">
            Enter the required information for each traveler and ensure it matches the government-issued ID.
          </p>

          <div className="mt-4 space-y-4">
            <h3 className="font-medium">Passenger 1 (Adult)</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="First name*" />
              <Input placeholder="Middle" />
              <Input placeholder="Last name*" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Suffix" />
              <Input placeholder="Date of birth*" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Email address*" />
              <Input placeholder="Phone number*" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Redress number" />
              <Input placeholder="Known traveler number" />
            </div>

            <h3 className="font-medium mt-6">Emergency contact information</h3>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sameAsPassenger" />
              <label htmlFor="sameAsPassenger">Same as Passenger 1</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input placeholder="First name*" />
              <Input placeholder="Last name*" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Email address*" />
              <Input placeholder="Phone number*" />
            </div>

            <h3 className="font-medium mt-6">Bag information</h3>
            <p className="text-sm text-gray-500">
              Each passenger is allowed one free carry-on bag and one personal item.
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <p>Checked bags</p>
              <button className="px-2 border rounded">-</button>
              <span>1</span>
              <button className="px-2 border rounded">+</button>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button variant="outline">Save and close</Button>
              <Button asChild>
                <Link to="/select-seats">Select seats</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Section with Sheet */}
        <Sheet>
          <SheetTrigger>
            <Button>View Summary</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Flight Summary</SheetTitle>
              <SheetDescription>
                Review your flight details and total costs.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 border rounded-lg">
                <p>Hawaiian Airlines - FIG4312</p>
                <p>18h 45m (−1d) - 7:00 AM to 4:15 PM</p>
              </div>
              <div className="bg-gray-50 p-4 border rounded-lg">
                <p>Hawaiian Airlines - FIG4312</p>
                <p>18h 45m (−1d) - 7:00 AM to 4:15 PM</p>
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

              <Button className="w-full mt-4">
                <Link to="/select-seats">Select seats</Link>
              </Button>
              <Button className="w-full mt-4">
                <Link to="/boardingpass">Boarding Pass</Link>
              </Button>    
            </div>
          </SheetContent>
        </Sheet>
      </div>
        </div>
      </div>
    </FullscreenSection>
  );
};

export default PassengerInfo;
