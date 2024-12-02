import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Selector from "./Selector";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { Flight } from "@/utils/types";
import { DialogDescription } from "@radix-ui/react-dialog";

const SeatSelection = ({
  selectedSeat,
  setSelectedSeat,
  selectedFlight,
}: {
  selectedSeat: string | null;
    setSelectedSeat: (s: string) => void;
    selectedFlight: Flight | null;
  }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen}
    open={open}>
      <DialogTrigger asChild>
        <Button className="mt-4">Select seat</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen p-2">
        <DialogHeader className="pb-2">
          <DialogTitle>Select seat</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Selector
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            selected_flight={selectedFlight}
          />
        </ScrollArea>
        {selectedSeat && <Button onClick={()=>{setOpen(false)}}>Confirm selection</Button>}
      </DialogContent>
    </Dialog>
  );
};

export default SeatSelection;
