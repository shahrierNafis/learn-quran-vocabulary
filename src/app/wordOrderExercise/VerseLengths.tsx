import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import inverseWordCount from "../../inverseWordCount.json";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useShallow } from "zustand/react/shallow";
import { useLocalStorage } from "@/stores/localStorage";

export default function VerseLengths() {
  const
    [verseLengths,
      addVerseLength,
      VLDialogOpen,
      removeVerseLength,
      setVLDialogOpen,
    ] = useLocalStorage(useShallow((state) => [state.verseLengths, state.addVerseLength, state.VLDialogOpen, state.removeVerseLength, state.setVLDialogOpen,]));

  return (
    <Dialog open={VLDialogOpen} onOpenChange={(open) => setVLDialogOpen(open)}>
      <DialogTrigger>
        <Button variant={"outline"}>
          Verses with length {JSON.stringify(verseLengths)}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <DialogTrigger>Verses with length</DialogTrigger>
          </DialogTitle>
          <DialogDescription className="overflow-y-auto max-h-[80vh]">
            {Object.entries(inverseWordCount).map(([count, verses]) => (
              <>
                <div className="flex items-center justify-between w-full gap-2 p-2">
                  <Checkbox
                    className="flex-grow-0"
                    checked={verseLengths.includes(+count)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addVerseLength(+count);
                      } else {
                        removeVerseLength(+count);
                      }
                    }}
                  />
                  <div className="flex-grow relative flex items-center justify-between">
                    <div
                      className="bg-gradient-to-r from-zinc-50 to-zinc-300 absolute z-0 h-full rounded-md"
                      style={{
                        width: `${((+((verses.length * 100) / 6236).toFixed(2) * 100) / 8.5).toFixed(2)}%`,
                      }}
                    ></div>
                    <div className="z-10 flex items-center justify-between w-full p-2">
                      verses with {count} words:
                      {verses.length}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
