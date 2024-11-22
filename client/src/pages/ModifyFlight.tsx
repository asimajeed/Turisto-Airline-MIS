import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ModifyFlight() {
    return (
        <div className="flex flex-col gap-6 p-6 bg-gradient-to-brbg-gradient-to-br  text-white min-h-screen">
            {/* Header */}
            <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
                <h1 className="text-2xl font-semibold text-white">Modify Booking</h1>
                <p className="text-sm text-white/70">Update your flight booking details here.</p>
            </div>

            {/* Flight Details Section */}
            <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
                <h2 className="text-xl font-semibold text-white">Flight Details</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label
                            htmlFor="booking-reference"
                            className="block text-sm font-medium text-white/70"
                        >
                            Booking Reference
                        </Label>
                        <Input
                            id="booking-reference"
                            type="text"
                            placeholder="Enter your booking reference"
                            className="bg-zinc-900 text-white placeholder-white/70 border border-white/20"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="passenger-name"
                            className="block text-sm font-medium text-white/70"
                        >
                            Passenger Name
                        </Label>
                        <Input
                            id="passenger-name"
                            type="text"
                            placeholder="Enter passenger name"
                            className="bg-zinc-900 text-white placeholder-white/70 border border-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* Modification Options Section */}
            <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
                <h2 className="text-xl font-semibold text-white">Modification Options</h2>
                <div className="mt-4 flex flex-col gap-4">
                    <div>
                        <Label className="block text-sm font-medium text-white/70">
                            Change Seat Preference
                        </Label>
                        <div className="mt-4 flex gap-4">
                            <Button variant="outline" className="text-white">Select Seats</Button>
                        </div>    
                    </div>
                </div>
            </div>

            {/* Summary and Actions Section */}
            <div className="p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
                <h2 className="text-xl font-semibold text-white">Summary</h2>
                <div className="mt-4 space-y-2">
                    <p className="text-sm text-white/70">
                        Review your changes before proceeding. Charges may apply for modifications.
                    </p>
                </div>
                <div className="mt-4 flex gap-4">
                    <Button variant="outline" className="text-white">Save Changes</Button>
                    <Button variant="outline" className="text-white">Cancel</Button>
                </div>
            </div>
        </div>
    );
}