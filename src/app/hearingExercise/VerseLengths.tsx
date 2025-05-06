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
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
type VerseLengths = {
  verseLengths: number[];
  setVerseLengths: (verseLengths: number[]) => void;
  addVerseLength: (verseLength: number) => void;
  removeVerseLength: (verseLength: number) => void;
  VLDialogOpen: boolean;
  setVLDialogOpen: (open: boolean) => void;
};

export const useVerseLengths = create<VerseLengths>()(
  persist(
    (set, get) => ({
      verseLengths: [4], // initial state
      setVerseLengths: (verseLengths: number[]) => set({ verseLengths }),
      addVerseLength: (verseLength: number) => {
        set((state) => ({
          verseLengths: [...state.verseLengths, verseLength],
        }));
      },
      removeVerseLength: (verseLength: number) => {
        set((state) => ({
          verseLengths: state.verseLengths.filter((i) => i !== verseLength),
        }));
      },
      VLDialogOpen: false,
      setVLDialogOpen: (open: boolean) => {
        set({ VLDialogOpen: open });
      },
    }),
    {
      name: "verseLengthsStorage", // name of the item in the storage (must be unique)
    }
  )
);

export default function VerseLengths() {
  const {
    verseLengths,
    addVerseLength,
    VLDialogOpen,
    removeVerseLength,
    setVLDialogOpen,
  } = useVerseLengths(useShallow((state) => state));

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
