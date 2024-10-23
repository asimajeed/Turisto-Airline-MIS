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

function App() {
  return (
    <>
      <FullscreenSection>
        <div
          className="bg-zinc-900 bg-cover bg-center bg-no-repeat h-full"
          style={{
            backgroundImage: `url(${Image})`,
            backgroundBlendMode: "exclusion",
          }}
        >
          
          {/* Main Content with Gradient Header */}
          <div className="flex flex-col items-center justify-center h-3/4 w-screen">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text text-center mb-16 pb-5">
              It's more than just a trip
            </h1>
            <div className="flex items-center justify-center mt-4 gap-2">
              <Select>
                <SelectTrigger className="text-white w-[180px]">
                  <SelectValue placeholder="Where to?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="text-white w-[180px]">
                  <SelectValue placeholder="From where?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange />
              <Link to = "/flights">
              <Button className="bg-zinc-600 hover:bg-zinc-700">Search</Button>
              </Link>            
            </div>
          </div>
        </div>
      </FullscreenSection>
    </>
  );
}

export default App;
