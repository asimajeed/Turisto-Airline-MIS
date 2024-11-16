import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";

const SelectAirports = () => {
  const [airportOptions, setAirportOptions] = useState<string[]>([]);
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  const [openFrom, setOpenFrom] = useState<boolean>(false);
  const [openTo, setOpenTo] = useState<boolean>(false);

  const fetchMoreAirports = async (search?: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/airports?search=${search ? search : "A"}`
      );
      console.log(`${search} = ${response.data}`);
      setAirportOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openFrom}
            className="w-[200px] justify-between"
          >
            <p className="overflow-hidden w-full">{fromValue || "From where?"}</p>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command className="overflow-hidden">
            <CommandInput
              placeholder="Search airport..."
              onValueChange={(str) => {
                setFromValue(str);
                fetchMoreAirports(str);
              }}
            />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <ScrollArea className="h-48 overflow-auto">
                <CommandGroup>
                  {airportOptions.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={(currentValue) => {
                        setFromValue(currentValue);
                        setOpenFrom(false);
                      }}
                    >
                      {option}
                      <Check
                        className={cn(
                          "ml-auto",
                          fromValue === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={openTo} onOpenChange={setOpenTo} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTo}
            className="w-[200px] justify-between"
          >
            <p className="overflow-hidden w-full">{toValue || "Where to?"}</p>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search airport..."
              onValueChange={(str) => {
                setToValue(str);
                fetchMoreAirports(str);
              }}
            />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <ScrollArea className="h-48 overflow-auto">
                <CommandGroup>
                  {airportOptions.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={(currentValue) => {
                        setToValue(currentValue);
                        setOpenTo(false);
                      }}
                    >
                      {option}
                      <Check
                        className={cn(
                          "ml-auto",
                          toValue === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectAirports;
