import { useState } from "react";

import { Button } from "@/components/ui/button";
import FullscreenSection from "@/components/FullscreenSection";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "@/assets/worldmap.png";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import SelectAirports from "@/components/AirportSelector/SelectAirports";
import MapComponent from "@/components/Map";

function App() {
  const [isOneWay, setIsOneWay] = useState(false);

  const handleOneWayChange = () => {
    setIsOneWay((prev) => !prev);
  };

  return (
    <>
      <FullscreenSection>
        <div
          className="bg-cover bg-center bg-no-repeat h-full"
          style={{
            backgroundImage: `url(${Image})`,
            backgroundBlendMode: "exclusion",
          }}
        >
          <div className="flex flex-col items-center justify-center h-3/4 w-screen">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-theme-secondary to-theme-primary text-transparent bg-clip-text text-center mb-16 pb-5">
              It's more than just a trip
            </h1>
            <div className="flex items-center justify-center mt-4 gap-2">
              {/* Airport selection component */}
              <SelectAirports />
              <div
                className="flex items-center border border-gray-300 h-9 w-fit px-3 rounded-md cursor-pointer"
                onClick={handleOneWayChange}
              >
                <Checkbox
                  checked={isOneWay}
                  onCheckedChange={handleOneWayChange}
                  className="mr-2 border size-5"
                />
                <span className="text-gray-500">One-Way</span>
              </div>
              {isOneWay ? <DatePickerDemo /> : <DatePickerWithRange />}
              <Link to="/flights">
                <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FullscreenSection>
      <MapComponent className="w-screen h-screen" />
    </>
  );
}

export default App;
