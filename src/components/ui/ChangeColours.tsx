import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";
import relations from "@/utils/relations";
import { PartOfSpeech } from "@/types/types";
import { ColourPicker } from "./ColourPicker";
import { Button } from "./button";
export default function ChangeColours() {
  const [colours, setColours] = usePreferenceStore(
    useShallow((a) => [a.colours, a.setColours])
  );

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex">
          <Button variant={"outline"} className="flex-grow">
            Change Colours
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Colours</DialogTitle>
            <DialogDescription>
              <div className="overflow-y-scroll max-h-[75vh]">
                {Object.keys(colours).map((pos) => {
                  return (
                    <>
                      <div className="grid grid-cols-2 my-4">
                        {relations[pos as PartOfSpeech] ?? "others"}
                        <div className="flex gap-4 ml-auto mr-4">
                          {" "}
                          <ColourPicker
                            {...{
                              value: colours[pos][0],
                              onChange: (value) => {
                                setColours(pos, value, colours[pos][1]);
                              },
                            }}
                          />{" "}
                          <ColourPicker
                            {...{
                              value: colours[pos][1],
                              onChange: (value) => {
                                setColours(pos, colours[pos][0], value);
                              },
                            }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })}{" "}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
