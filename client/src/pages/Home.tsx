import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FullscreenSection from "@/components/FullscreenSection";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { DatePicker } from "@/components/ui/DatePicker";
import SelectAirports from "@/components/AirportSelector/SelectAirports";
import MapComponent from "@/components/Map";
import { useGlobalStore } from "@/context/GlobalStore";

function Home() {
  const { isOneWay, setIsOneWay, departure_airport, arrival_airport, start_date } = useGlobalStore();
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  useEffect(() => {
    const isFilled = !!departure_airport && !!arrival_airport && !!start_date;
    setIsSearchEnabled(isFilled);
  }, [departure_airport, arrival_airport, start_date]);

  const handleOneWayChange = () => {
    setIsOneWay(!isOneWay);
  };

  return (
    <>
      <FullscreenSection>
        <MapComponent className="h-screen">
          <div className="flex flex-col items-center justify-center h-3/4 w-screen">
            <h1 className="text-6xl xl:text-8xl font-bold bg-gradient-to-r from-theme-secondary to-theme-primary text-transparent bg-clip-text text-center mb-16 pb-5">
              It's more than just a trip
            </h1>
            <div className="flex flex-wrap items-center justify-center mt-4 gap-2">
              {/* Airport selection component */}
              <SelectAirports />
              <div
                className="flex items-center border border-muted h-9 w-32 px-3 rounded-md cursor-pointer"
                onClick={handleOneWayChange}
              >
                <Checkbox
                  checked={isOneWay}
                  onCheckedChange={handleOneWayChange}
                  onClick={handleOneWayChange}
                  className="mr-2 border size-5"
                />
                <span className="text-foreground select-none">One-Way</span>
              </div>
              {isOneWay ? <DatePicker /> : <DatePickerWithRange />}
              <Link to={isSearchEnabled ? "/flights" : "#"} onClick={(e) => !isSearchEnabled && e.preventDefault()}>
                <Button
                  className="bg-theme-primary hover:bg-theme-primary-highlight text-white"
                  disabled={!isSearchEnabled}
                >
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </MapComponent>
      </FullscreenSection>
    </>
  );
}

export default Home;
