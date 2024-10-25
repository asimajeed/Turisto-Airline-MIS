// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Image from "@/assets/worldmap.png";
// import FullscreenSection from "@/components/FullscreenSection";
// import { Link } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const FlightsTable = () => {
//   return (
//     <FullscreenSection>
//       <div
//         className="bg-zinc-900 bg-cover bg-center bg-no-repeat h-full p-8 md:p-16"
//         style={{
//           backgroundImage: `url(${Image})`,
//           backgroundBlendMode: "exclusion",
//         }}
//       >
//         {/* <div>
//           <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text text-center mb-16 pb-5">
//             Every Destination in Reach
//           </h1>
//         </div> */}

//         <div className="flex items-center justify-center mt-4 gap-4">
//           <Select>
//             <SelectTrigger className="text-white w-[180px]">
//               <SelectValue placeholder="Where to?" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="light">Light</SelectItem>
//               <SelectItem value="dark">Dark</SelectItem>
//               <SelectItem value="system">System</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select>
//             <SelectTrigger className="text-white w-[180px]">
//               <SelectValue placeholder="From where?" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="light">Light</SelectItem>
//               <SelectItem value="dark">Dark</SelectItem>
//               <SelectItem value="system">System</SelectItem>
//             </SelectContent>
//           </Select>
//           <DatePickerWithRange />
//           <Link to="/flights">
//             <Button className="bg-zinc-600 hover:bg-zinc-700">Search</Button>
//           </Link>
//         </div>

//         <div className="max-w-5xl mx-auto space-y-4">
//           <Table className="text-white z-10">
//             <TableCaption>A list of your recent flight searches.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-gray-400">Flight No.</TableHead>
//                 <TableHead className="text-gray-400">Departure</TableHead>
//                 <TableHead className="text-gray-400">Destination</TableHead>
//                 <TableHead className="text-gray-400">Status</TableHead>
//                 <TableHead className="text-right">Price</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell className="font-medium">FL123</TableCell>
//                 <TableCell>New York (JFK)</TableCell>
//                 <TableCell>London (LHR)</TableCell>
//                 <TableCell>On Time</TableCell>
//                 <TableCell className="text-right">$600.00</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">FL456</TableCell>
//                 <TableCell>Los Angeles (LAX)</TableCell>
//                 <TableCell>Tokyo (HND)</TableCell>
//                 <TableCell>Delayed</TableCell>
//                 <TableCell className="text-right">$850.00</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">FL789</TableCell>
//                 <TableCell>Paris (CDG)</TableCell>
//                 <TableCell>Dubai (DXB)</TableCell>
//                 <TableCell>On Time</TableCell>
//                 <TableCell className="text-right">$750.00</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell className="font-medium">FL101</TableCell>
//                 <TableCell>Sydney (SYD)</TableCell>
//                 <TableCell>Singapore (SIN)</TableCell>
//                 <TableCell>Canceled</TableCell>
//                 <TableCell className="text-right">$500.00</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </FullscreenSection>
//   );
// };

// export default FlightsTable;


import {
  Table,
  TableBody,
  TableCaption,
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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import PriceTable from "@/components/PriceTable";

export const description = "A stacked area chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const flights = [
  { flightNo: "FL123", departure: "New York (JFK)", destination: "London (LHR)", status: "On Time", price: "$600.00" },
  { flightNo: "FL456", departure: "Los Angeles (LAX)", destination: "Tokyo (HND)", status: "Delayed", price: "$850.00" },
  { flightNo: "FL789", departure: "Paris (CDG)", destination: "Dubai (DXB)", status: "On Time", price: "$750.00" },
  { flightNo: "FL101", departure: "Sydney (SYD)", destination: "Singapore (SIN)", status: "Canceled", price: "$500.00" }
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
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const FlightsTable = () => {
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
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="SFO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SFO">SFO</SelectItem>
                  <SelectItem value="LAX">LAX</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="NRT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NRT">NRT</SelectItem>
                  <SelectItem value="HND">HND</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange />
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
              <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
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
            <h3 className="text-xl font-bold">Choose a departing flight</h3>
            <div className="bg-gray-100 p-4 rounded-lg mt-4 hover: bg-inherit ">
              <Table className="z-10">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-800">Flight No.</TableHead>
                    <TableHead className="text-gray-800">Departure</TableHead>
                    <TableHead className="text-gray-800">Destination</TableHead>
                    <TableHead className="text-gray-800">Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((flight, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{flight.flightNo}</TableCell>
                      <TableCell>{flight.departure}</TableCell>
                      <TableCell>{flight.destination}</TableCell>
                      <TableCell>{flight.status}</TableCell>
                      <TableCell className="text-right">{flight.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="link" className="mt-4">Show all flights</Button>
            </div>
          </div>

          {/* Price Grid and History */}
          <div className="w-full flex justify-between space-x-4"> {/* Added flex and space between */}
            {/* Price Grid */}
            <div className="w-1/2">
              <h4 className="text-lg font-bold">Price grid (flexible dates)</h4>
              <div className="mt-4 border rounded-lg border-gray-200">
                <PriceTable></PriceTable>
              </div>
            </div>

            {/* Price History */}
            <div className="w-1/2">
              <h4 className="text-lg font-bold">Price history</h4>
              <div className="p-4 rounded-lg">
                <Card>
                  <CardHeader>
                    <CardTitle>Area Chart - Stacked</CardTitle>
                    <CardDescription>
                      Showing total visitors for the last 6 months
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
                          dataKey="mobile"
                          type="natural"
                          fill="var(--color-mobile)"
                          fillOpacity={0.4}
                          stroke="var(--color-mobile)"
                          stackId="a"
                        />
                        <Area
                          dataKey="desktop"
                          type="natural"
                          fill="var(--color-desktop)"
                          fillOpacity={0.4}
                          stroke="var(--color-desktop)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
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
