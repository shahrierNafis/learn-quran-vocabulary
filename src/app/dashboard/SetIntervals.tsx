import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/database.types";
import getIntervals from "@/utils/getIntervals";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";
import AddInterval from "./AddInterval";

export default function SetIntervals() {
  const [intervals, setIntervals] = useState<{ [key: number]: number }>();
  useEffect(() => {
    getIntervals().then(setIntervals);

    return () => {};
  }, []);
  const supabase = createClient<Database>();
  function handleInpuTChange(
    e: React.ChangeEvent<HTMLInputElement>,
    progress: number
  ) {
    setIntervals((prev) => ({
      ...prev,
      [progress]: +e.target.value * 8.64e7,
    }));

    supabase
      .from("user_intervals")
      .update({ interval_ms: +e.target.value * 8.64e7 })
      .eq("progress", progress)
      .then();
  }
  function handleDelete(progress: number) {
    setIntervals((prev) => {
      const newIntervals = { ...prev };
      delete newIntervals[progress];
      return newIntervals;
    });
    supabase.from("user_intervals").delete().eq("progress", progress).then();
  }
  return (
    <>
      <div>Intervals</div>
      <div className="border p-2">
        {intervals &&
          Object.keys(intervals).map((progress) => {
            return (
              <div
                key={progress}
                className="flex justify-start border p-2 items-center gap-2"
              >
                {progress} :{" "}
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
                      Delete
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        <AddInterval {...{ setIntervals }} />
      </div>
    </>
  );
}
