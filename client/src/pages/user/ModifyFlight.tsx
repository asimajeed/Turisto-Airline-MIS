import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ModifyFlight() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-brbg-gradient-to-br text-foreground min-h-screen">
      {/* Header */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h1 className="text-2xl font-semibold text-foreground
  ">Modify Booking</h1>
        <p className="text-sm text-foreground
  /70">
          Update your flight booking details here.
        </p>
      </div>

      {/* Flight Details Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground
  ">Flight Details</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="booking-reference"
              className="block text-sm font-medium text-foreground/70">
              Booking Reference
            </Label>
            <Input
              id="booking-reference"
              type="text"
              placeholder="Enter your booking reference"
              className=" text-foreground
         placeholder-white/70 border border-white/20"
            />
          </div>
          <div>
            <Label
              htmlFor="passenger-name"
              className="block text-sm font-medium text-foreground
        /70"
            >
              Passenger Email
            </Label>
            <Input
              id="passenger-name"
              type="email"
              placeholder="Enter passenger email"
              className=" text-foreground
         placeholder-white/70 border border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Modification Options Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground
  ">
          Modification Options
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label className="block text-sm font-medium text-foreground
      /70">
              Change Seat Preference
            </Label>
            <div className="mt-4 flex gap-4">
              <Button variant="outline" className="text-foreground
        ">
                Select Seats
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Actions Section */}
      <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-foreground
  ">Save Changes</h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-foreground
    /70">
            Review your changes before proceeding. Charges may apply for
            modifications.
          </p>
        </div>
        <div className="mt-4 flex gap-4">
          <Button variant="outline" className="text-foreground
    ">
            Save Changes
          </Button>
          <Button variant="outline" className="text-foreground
    ">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
