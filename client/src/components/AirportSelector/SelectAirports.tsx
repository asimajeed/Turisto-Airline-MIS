import { useState } from "react";
import SelectBox from "./SelectBox";
import { airportType } from "@/utils/types";
import { useGlobalStore } from "@/context/GlobalStore";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";

const SelectAirports = () => {
  const [airportOptions, setAirportOptions] = useState<airportType[]>([]);
  const {
    departure_airport: fromValue,
    arrival_airport: toValue,
    setDepartureAirport: setFromValue,
    setArrivalAirport: setToValue,
  } = useGlobalStore();

  return (
    <div className="flex">
      <SelectBox
        icon={PlaneTakeoff}
        label="From where?"
        value={fromValue}
        setValue={setFromValue}
        options={airportOptions}
        setOptions={setAirportOptions}
      />
      <SelectBox
        icon={PlaneLanding}
        label="Where to?"
        value={toValue}
        setValue={setToValue}
        options={airportOptions}
        setOptions={setAirportOptions}
      />
    </div>
  );
};

export default SelectAirports;
