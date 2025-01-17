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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, FC, useEffect } from "react";
import { airportType } from "@/utils/types";
import axios from "axios";
import { LucideIcon } from "lucide-react";

interface ComboBoxProps {
  icon: LucideIcon; // Type for the icon component
  label: string;
  value: airportType | null;
  setValue: (value: airportType) => void;
  options: airportType[];
  setOptions: (options: airportType[]) => void;
}

const SelectBox: FC<ComboBoxProps> = ({
  icon: Icon, // Rename `icon` to `Icon` to treat it as a component
  label,
  value,
  setValue,
  options,
  setOptions,
}) => {
  const [open, setOpen] = useState(false);

  const fetchMoreAirports = async (search?: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/airports?search=${
          search || ""
        }`
      );
      console.log(`${import.meta.env.VITE_BACKEND_API_URL}/api/airports?search=${
          search || ""
        }`, response.data);
      setOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMoreAirports();
    };
    fetchData();
  }, []);

  const handleInputChange = (str: string) => {
    fetchMoreAirports(str);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between mx-0.5"
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <Icon className="w-5 h-5" /> {/* Properly render the icon */}
            <span className="overflow-hidden w-full">
              {value ? `${value.airport_code}, ${value.airport_name}` : label}
            </span>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="overflow-hidden">
          <CommandInput
            placeholder="Search airport..."
            onValueChange={(str) => handleInputChange(str)}
          />
          <CommandList>
            <CommandEmpty>No airport found.</CommandEmpty>
            <ScrollArea className="h-48 overflow-auto">
              <CommandGroup>
                {options.map((option) => {
                  const optionString = `${option.airport_code}, ${option.airport_name}, ${option.city}, ${option.country}`;
                  return (
                    <CommandItem
                      key={optionString}
                      value={optionString}
                      onSelect={() => {
                        setValue(option);
                        setOpen(false);
                      }}
                    >
                      {optionString}
                      <Check
                        className={cn(
                          "ml-auto",
                          value?.airport_code === option.airport_code
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBox;
