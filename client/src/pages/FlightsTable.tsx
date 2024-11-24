import { useEffect, useState } from "react";
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
import SelectAirports from "@/components/AirportSelector/SelectAirports";
import axios from "axios";
import { useGlobalStore } from "@/context/GlobalStore";
import { FaSpinner } from "react-icons/fa";
import { Flight } from "@/utils/types";
import MapComponent from "@/components/Map";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const FlightsTable = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const {
    isOneWay,
    setIsOneWay,
    arrival_airport,
    departure_airport,
    start_date,
    selected_flight,
    setSelectedFlight,
  } = useGlobalStore();

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setErrorMsg(undefined);

      if (start_date && departure_airport && arrival_airport)
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/flights`,
            {
              params: {
                departure_date: start_date.toUTCString(),
                departure_airport_id: departure_airport.airport_id,
                arrival_airport_id: arrival_airport.airport_id,
                page: currentPage,
              },
            }
          );
          const data = response.data; // Directly use the data from the response
          setFlights(data); // Update the state with fetched flights
        } catch (error: any) {
          setErrorMsg(error?.message || "Error fetching flights"); // Capture any error
        } finally {
          setLoading(false);
        }
    };

    fetchFlights();
  }, [start_date, departure_airport, arrival_airport, currentPage]);

  const handleOneWayChange = () => {
    setIsOneWay(!isOneWay);
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handlePageChange = (page: number) => {
    if (flights.length === 0 && page >= 0) setCurrentPage(page - 1);
    else alert("No additional flights match your current selection.");
  };

  return (
    <MapComponent className="h-screen">
      <div className="h-full mt-8 p-4 md:p-8 lg:p-16">
        {/* Flight Search Header */}
        <div className="flex flex-wrap items-center gap-4">
          <SelectAirports />
          <div
            className="flex min-w-fit items-center border h-9 px-3 rounded-md cursor-pointer"
            onClick={handleOneWayChange}
          >
            <Checkbox
              checked={isOneWay}
              onCheckedChange={handleOneWayChange}
              className="mr-2 border size-5"
            />
            <span className="min-w-fit">One-Way</span>
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
          <Link to="/flights" className="mt-2 md:mt-0">
            <Button className="bg-theme-primary hover:bg-theme-primary-highlight text-white">
              Search
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline">Sort price</Button>
          <Button variant="outline">Sort time</Button>
          <Button variant="outline">Times</Button>
          <Button variant="outline">Airlines</Button>
          <Button variant="outline">Seat class</Button>
        </div>

        {/* Flights Table */}
        <div className="mt-8">
          <h3 className="text-theme-primary-darker text-xl font-bold">
            Choose a departing flight
          </h3>
          {errorMsg ? (
            <div className="bg-red-500 bg-opacity-60 text-center text-foreground p-2 m-2 rounded">
              {errorMsg}
            </div>
          ) : !isLoading && flights.length === 0 ? (
            <div className="text-foreground mt-5 text-lg">
              Flights unavailable for this selection.
            </div>
          ) : (
            ""
          )}
          <div className="p-4 rounded-lg mt-4 hover:bg-inherit overflow-x-auto">
            {isLoading ? (
              <div className="py-32 flex justify-center items-center">
                <FaSpinner className="animate-spin text-theme-primary-darker size-10" />
              </div>
            ) : (
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-primary-darker">
                      Flight No.
                    </TableHead>
                    <TableHead className="text-theme-primary-darker">
                      Departure Airport
                    </TableHead>
                    <TableHead className="text-theme-primary-darker">
                      Arrival Airport
                    </TableHead>
                    <TableHead className="text-theme-primary-darker">
                      Status
                    </TableHead>
                    <TableHead className="text-theme-primary-darker text-right">
                      Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((flight: Flight, index) => (
                    <TableRow
                      key={index}
                      className={`cursor-pointer ${
                        selected_flight?.flight_number === flight.flight_number
                          ? "bg-theme-primary-light text-theme-primary"
                          : ""
                      }`}
                      onClick={() => handleFlightSelect(flight)}
                    >
                      <TableCell className="font-medium">
                        {flight.flight_number}
                      </TableCell>
                      <TableCell>{departure_airport?.airport_code}</TableCell>
                      <TableCell>{arrival_airport?.airport_code}</TableCell>
                      <TableCell>{flight.status}</TableCell>
                      <TableCell className="text-right">
                        {flight.base_price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* Conditionally render Confirm Flight Button */}
            {selected_flight && (
              <Link to="/passenger">
                <Button className="mt-4 bg-theme-primary hover:bg-theme-primary-highlight text-white">
                  Confirm Flight
                </Button>
              </Link>
            )}
          </div>
          {/* Pagination */}
          <Pagination className="select-none">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 0) handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  isActive={currentPage === 0}
                  onClick={() => handlePageChange(0)}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </MapComponent>
  );
};

export default FlightsTable;
