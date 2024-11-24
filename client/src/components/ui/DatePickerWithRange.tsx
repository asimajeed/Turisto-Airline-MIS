"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalStore } from "@/context/GlobalStore";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { start_date, end_date, setStartDate, setEndDate } = useGlobalStore();
  const date: DateRange | undefined = {
    from: start_date || undefined,
    to: end_date || undefined,
  };
  const setDate = (d: DateRange | undefined) => {
    setStartDate(d?.from || null);
    setEndDate(d?.to || null);
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date.from && "text-muted-foreground"
            )}
            style={{ width: "13.5rem" }}
          >
            <CalendarIcon className="h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d LLL y")} - {format(date.to, "d LLL y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            fromDate={new Date()}
            selected={date}
            onSelect={setDate}
            weekStartsOn={1}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
