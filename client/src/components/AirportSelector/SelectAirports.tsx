import { useState, useEffect } from "react";
import SelectBox from "./SelectBox";
import { airportType } from "@/utils/types";
import { useGlobalContext } from "@/context/GlobalContext";

const SelectAirports = () => {
  const [airportOptions, setAirportOptions] = useState<airportType[]>([]);
  const { data: user, setContext: setUserInfo } = useGlobalContext();
  const fromValue = user.departure_airport;
  const setFromValue = (fromValue: airportType) =>
    setUserInfo({
      ...user,
      departure_airport: fromValue,
    });
  const toValue = user.arrival_airport;
  const setToValue = (toValue: airportType) =>
    setUserInfo({
      ...user,
      arrival_airport: toValue,
    });

  useEffect(() => {
    console.log("User data set", user);
  });

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
