//import { Label } from "@/components/ui/label"
//import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "@/assets/worldmap.png"; // Replace with correct path
import FullscreenSection from "@/components/FullscreenSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import PriceTable from "@/components/PriceTable";
import SelectAirports from "@/components/AirportSelector/SelectAirports";

export const description = "A stacked area chart";
interface Flight {
  flightNo: string;
  departure: string;
  destination: string;
  status: string;
  price: string;
}

const chartData = [
  { month: "January", economy: 150, business: 350 },
  { month: "February", economy: 160, business: 360 },
  { month: "March", economy: 140, business: 340 },
  { month: "April", economy: 180, business: 380 },
  { month: "May", economy: 170, business: 390 },
  { month: "June", economy: 190, business: 400 },
];

const flights : Flight[] = [
  {
    flightNo: "FL123",
    departure: "New York (JFK)",
    destination: "London (LHR)",
    status: "On Time",
    price: "$600.00",
  },
  {
    flightNo: "FL456",
    departure: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    status: "Delayed",
    price: "$850.00",
  },
  {
    flightNo: "FL789",
    departure: "Paris (CDG)",
    destination: "Dubai (DXB)",
    status: "On Time",
    price: "$750.00",
  },
  {
    flightNo: "FL101",
    departure: "Sydney (SYD)",
    destination: "Singapore (SIN)",
    status: "Canceled",
    price: "$500.00",
  },
];

//---------------API CAll
// import axios from 'axios';
// const fetchFlightData = async () => {
//   try {
//     const response = await axios.get('http://localhost:5173/getFlightsData');
//     const flightsData = response.data; // Assuming data is in response.data
//     return flightsData;
//   } catch (error) {
//     console.error("Error fetching flight data:", error);
//     return [];
//   }
// };

const chartConfig = {
  economy: {
    label: "Economy",
    color: "hsl(var(--chart-1))",
  },
  business: {
    label: "Business",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const FlightsTable = () => {
  const [isOneWay, setIsOneWay] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);



  const handleOneWayChange = () => {
    setIsOneWay((prev) => !prev);
  };

  const handleFlightSelect = (flight : Flight) => {
    setSelectedFlight(flight);
  };

  return (
    <FullscreenSection>
      <div
        className="bg-inherit bg-cover bg-center bg-no-repeat h-full p-8 md:p-16"
        style={{
          backgroundImage: `url(${Image})`,
          backgroundBlendMode: "exclusion",
        }}
      >
        <div className=" h-full p-8 md:p-16">
          {/* Flight Search Header */}
          <div className="flex items-center  mt-4 gap-4">
            <div className="flex gap-2">
              <SelectAirports />
              <div
                className="flex items-center border h-9 w-fit px-3 rounded-md cursor-pointer"
                onClick={handleOneWayChange}
              >
                <Checkbox
                  checked={isOneWay}
                  onCheckedChange={handleOneWayChange}
                  className="mr-2 border size-5"
                />
                <span className="flex flex-auto">One-Way</span>
              </div>
              {isOneWay ? <DatePicker /> : <DatePickerWithRange />}
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="1 adult" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 adult">1 adult</SelectItem>
                  <SelectItem value="2 adults">2 adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/flights">
              <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white">
                Search
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline">Max price</Button>
            <Button variant="outline">Shops</Button>
            <Button variant="outline">Times</Button>
            <Button variant="outline">Airlines</Button>
            <Button variant="outline">Seat class</Button>
            <Button variant="outline">More</Button>
          </div>

          <div className="mt-8">
            <h3 className="text-theme-primary-darker text-xl font-bold">
              Choose a departing flight
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg mt-4 hover: bg-inherit ">
              <Table className="z-10">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-primary-darker">Flight No.</TableHead>
                    <TableHead className="text-theme-primary-darker">Departure</TableHead>
                    <TableHead className="text-theme-primary-darker">Destination</TableHead>
                    <TableHead className="text-theme-primary-darker">Status</TableHead>
                    <TableHead className="text-theme-primary-darker text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((flight : Flight, index) => (
                    <TableRow
                      key={index}
                      className={`cursor-pointer ${selectedFlight?.flightNo === flight.flightNo
                          ? "bg-theme-primary-light text-white"
                          : "hover:bg-inherit"
                        }`}
                      onClick={() => handleFlightSelect(flight)}
                    >
                      <TableCell className="font-medium">
                        {flight.flightNo}
                      </TableCell>
                      <TableCell>{flight.departure}</TableCell>
                      <TableCell>{flight.destination}</TableCell>
                      <TableCell>{flight.status}</TableCell>
                      <TableCell className="text-right">
                        {flight.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Conditionally render Confirm Flight Button */}
              {selectedFlight && (
                <Link to="/passenger">
                  <Button className="mt-4 bg-theme-primary hover:bg-theme-primary-highlight text-white">
                    Confirm Flight
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Price Grid and History */}
          <div className="w-full flex justify-between space-x-4">
            {" "}
            {/* Added flex and space between */}
            {/* Price Grid */}
            <div className="w-1/2">
              <h4 className="text-lg  text-theme-primary-darker  font-bold">
                Price grid (flexible dates)
              </h4>
              <div className="mt-4 border rounded-lg border-gray-200">
                <PriceTable></PriceTable>
              </div>
            </div>
            {/* Price History */}
            <div className="w-1/2">
              <h4 className="text-lg text-theme-primary-darker  font-bold">
                Price history
              </h4>
              <div className="p-4 rounded-lg">
                <Card>
                  <CardHeader>
                    <CardTitle>Area Chart - Flight Prices</CardTitle>
                    <CardDescription>
                      Showing average flight prices for the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                          dataKey="economy"
                          type="natural"
                          fill="var(--color-economy)"
                          fillOpacity={0.4}
                          stroke="var(--color-economy)"
                          stackId="a"
                        />
                        <Area
                          dataKey="business"
                          type="natural"
                          fill="var(--color-business)"
                          fillOpacity={0.4}
                          stroke="var(--color-business)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                          Trending up by 5.2% this month{" "}
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                          January - June 2024
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
};

export default FlightsTable;
