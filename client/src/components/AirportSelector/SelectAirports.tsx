import { useState, useEffect } from "react";
import SelectBox from "./SelectBox";
import { airportType } from "@/utils/types";
import { useUserContext } from "@/context/UIContext";

const SelectAirports = () => {
  const [airportOptions, setAirportOptions] = useState<airportType[]>([]);
  const [fromValue, setFromValue] = useState<airportType | null>(null);
  const [toValue, setToValue] = useState<airportType | null>(null);
  const { user, setUserInfo } = useUserContext();

  useEffect(() => {
    if (fromValue) {
      setUserInfo({
        ...user,
        departure_airport: fromValue,
      });
    }
  }, [fromValue]);

  useEffect(() => {
    if (toValue) {
      setUserInfo({
        ...user,
        arrival_airport: toValue,
      });
    }
  }, [toValue]);

  return (
    <div>
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
