import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useState } from "react";
import AddInterval from "./AddInterval";
import { usePreferenceStore } from "@/stores/preference-store";
import { useShallow } from "zustand/react/shallow";

export default function SetIntervals() {
  const [intervals, setInterval, removeInterval] = usePreferenceStore(
    useShallow((state) => [
      state.intervals,
      state.setInterval,
      state.removeInterval,
    ])
  );
  const supabase = createClient<Database>();
  function handleInpuTChange(
    e: React.ChangeEvent<HTMLInputElement>,
    progress: number
  ) {
    setInterval(progress, +e.target.value * 8.64e7);

    supabase
      .from("user_intervals")
      .update({ interval_ms: +e.target.value * 8.64e7 })
      .eq("progress", progress)
      .then();
  }
  function handleDelete(progress: number) {
    removeInterval(progress);
  }
  return (
    <>
      <div>
        <div className="text-center border p-2 bg-secondary">
          Review Intervals
        </div>
        <div className="text-center border p-2 flex flex-col justify-center items-center gap-2">
          <div className="grid grid-cols-2 ">
            <div className="text-center"> A verse that is</div>
            <div className="text-center">will be seen again in</div>
            {intervals &&
              Object.keys(intervals).map((progress) => {
                return (
                  <>
                    <div
                      key={progress}
                      className="flex gap-1 justify-center items-center border"
                    >
                      {progress}% Mastered{" "}
                    </div>
                    <div className="flex gap-1 justify-start items-center">
                      <Input
                        type="number"
                        className="max-w-20"
                        value={intervals[+progress] / 8.64e7}
                        onChange={(e) => handleInpuTChange(e, +progress)}
                      />
                      <div>days</div>
                      {+progress != 100 && (
                        <>
                          <Button
                            onClick={() => handleDelete(+progress)}
                            size={"sm"}
                            variant={"destructive"}
                          >
                            remove
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                );
              })}
          </div>{" "}
          <AddInterval {...{ setInterval }} />
        </div>
      </div>
    </>
  );
}
