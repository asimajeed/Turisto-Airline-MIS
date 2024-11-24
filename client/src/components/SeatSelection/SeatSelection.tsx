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

const SeatSelection = ({
  selectedSeat,
  setSelectedSeat,
}: {
  selectedSeat: string | null;
  setSelectedSeat: (s:string)=>void;
  }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen}
    open={open}>
      <DialogTrigger>
        <Button className="w-full mt-4">Select seats</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen p-2">
        <DialogHeader className="pb-2">
          <DialogTitle>Select seat</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Selector
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
          />
        </ScrollArea>
        {selectedSeat && <Button onClick={()=>{setOpen(false)}}>Confirm selection</Button>}
      </DialogContent>
    </Dialog>
  );
};

export default SeatSelection;
