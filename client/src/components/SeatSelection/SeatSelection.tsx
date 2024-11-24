import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Selector from "./Selector";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  return (
    <Dialog >
      <DialogTrigger >
        <Button className="w-full mt-4">
          Select seats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen p-2">
        <DialogHeader className="pb-2">
          <DialogTitle >Select seat</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Selector selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} />
        </ScrollArea>
        {selectedSeat && <Button>Confirm selection</Button>}
        </DialogContent>
    </Dialog>
  );
};

export default SeatSelection;
