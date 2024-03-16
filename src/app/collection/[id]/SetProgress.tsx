import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import { Progress } from "@/utils/getProgress";
import setProgressInDB from "@/utils/setProgress";

export default function SetProgress({
  id,
  setProgress,
  rowSelection,
  progress,
  progressID,
}: {
  id: string;
  setProgress: React.Dispatch<
    React.SetStateAction<[Progress, number | undefined | null]>
  >;
  rowSelection: RowSelectionState;
  progress: Progress;
  progressID: number | undefined | null;
}) {
  const [range, setRange] = useState<number[]>([0]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  async function handleSet() {
    if (Object.keys(rowSelection).length == 0) {
      return; // return if no row is selected
    }

    const newProgress: Progress = {};
    // update progress
    setProgress(([oldProgress, id]) => {
      // copy old progress
      Object.assign(newProgress, oldProgress);
      // set new progress
      Object.keys(rowSelection).map((key) => {
        // Skip subRows
        if (/^-?[0-9]+$/.test(key)) {
          const newObj = newProgress[+key] ?? {};
          newObj.percentage = range[0];
          newObj.updatedOn = date?.toISOString();
          newProgress[+key] = newObj;
        }
      });
      // update state
      return [newProgress, id];
    });

    // update progress in DB
    setProgressInDB({
      progressID,
      collectionID: +id,
      progress: newProgress,
    }).then(setProgress);
  }
  return (
    <>
      <div className="m-2 flex flex-col justify-center items-center mx-auto">
        Set Progress of selected rows:
        <div className="w-full flex flex-col gap-8 items-center">
          <Slider
            className="w-[75%] sm:w-[45%] flex-shrink-0 border-primary"
            onValueChange={setRange}
            value={range}
            max={100}
            step={1}
          />
          <DatePicker {...{ date, setDate }} />
          <Button onClick={handleSet}>Set {range}%</Button>
        </div>
      </div>
    </>
  );
}
