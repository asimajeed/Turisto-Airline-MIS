import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "@/assets/worldmap.png";
import FullscreenSection from "@/components/FullscreenSection";

const FlightsTable = () => {
  return (
    <FullscreenSection>
      <div
        className="bg-zinc-900 bg-cover bg-center bg-no-repeat h-full p-8 md:p-16"
        style={{
          backgroundImage: `url(${Image})`,
          backgroundBlendMode: "exclusion",
        }}
      >
        <div>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text text-center mb-16 pb-5">
            Every Destination in Reach
          </h1>
        </div>
        <div className="max-w-5xl mx-auto">
          <Table className="text-white z-10">
            <TableCaption>A list of your recent flight searches.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Flight No.</TableHead>
                <TableHead className="text-gray-400">Departure</TableHead>
                <TableHead className="text-gray-400">Destination</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">FL123</TableCell>
                <TableCell>New York (JFK)</TableCell>
                <TableCell>London (LHR)</TableCell>
                <TableCell>On Time</TableCell>
                <TableCell className="text-right">$600.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FL456</TableCell>
                <TableCell>Los Angeles (LAX)</TableCell>
                <TableCell>Tokyo (HND)</TableCell>
                <TableCell>Delayed</TableCell>
                <TableCell className="text-right">$850.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FL789</TableCell>
                <TableCell>Paris (CDG)</TableCell>
                <TableCell>Dubai (DXB)</TableCell>
                <TableCell>On Time</TableCell>
                <TableCell className="text-right">$750.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FL101</TableCell>
                <TableCell>Sydney (SYD)</TableCell>
                <TableCell>Singapore (SIN)</TableCell>
                <TableCell>Canceled</TableCell>
                <TableCell className="text-right">$500.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </FullscreenSection>
  );
};

export default FlightsTable;
