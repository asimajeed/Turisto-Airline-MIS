import { useState } from "react";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "@/assets/worldmap.png";
import FullscreenSection from "@/components/FullscreenSection";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerDemo } from "@/components/ui/DatePicker";

function App() {
  const [isOneWay, setIsOneWay] = useState(false);

  // Array of options for Select items
  const destinationOptions = ["New York", "London", "Tokyo", "Paris"];
  const originOptions = ["New York", "London", "Tokyo", "Paris"];

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
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-center mb-16 pb-5">
              It's more than just a trip
            </h1>
            <div className="flex items-center justify-center mt-4 gap-2">
              <Select>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300 text-gray-500">
                  <SelectValue placeholder="Where to?" />
                </SelectTrigger>
                <SelectContent>
                  {destinationOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300 text-gray-500">
                  <SelectValue placeholder="From where?" />
                </SelectTrigger>
                <SelectContent>
                  {originOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center border border-gray-300 h-9 w-fit px-3 rounded-md cursor-pointer"
                onClick={handleOneWayChange}>
                <Checkbox
                  checked={isOneWay}
                  onCheckedChange={handleOneWayChange}
                  className=" mr-2 border size-5"
                />
                <span className="text-gray-500">One-Way</span>
              </div>
              {isOneWay ? <DatePickerDemo /> : <DatePickerWithRange />}
              <Link to="/flights">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FullscreenSection>
    </>
  );
}

export default App;
