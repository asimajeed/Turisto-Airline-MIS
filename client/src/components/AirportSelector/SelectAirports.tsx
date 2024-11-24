import { useState } from "react";
import SelectBox from "./SelectBox";
import { airportType } from "@/utils/types";
import { useGlobalStore } from "@/context/GlobalStore";

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
        label="From where?"
        value={fromValue}
        setValue={setFromValue}
        options={airportOptions}
        setOptions={setAirportOptions}
      />
      <SelectBox
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
