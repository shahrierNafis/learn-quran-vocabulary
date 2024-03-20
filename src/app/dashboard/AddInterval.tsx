import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/clients";
import { Database } from "@/database.types";

export default function AddInterval({
  setIntervals,
}: {
  setIntervals: React.Dispatch<
    React.SetStateAction<{ [key: number]: number } | undefined>
  >;
}) {
  const [progress, setProgress] = useState<number>();
  const [interval, setInterval] = useState<number>();
  const supabase = createClient<Database>();
  function handleAdd() {
    if (progress === undefined || interval === undefined) return;
    setIntervals((prev) => ({
      ...prev,
      [progress]: interval,
    }));
    supabase
      .from("user_intervals")
      .upsert({ progress, interval_ms: interval })
      .then();
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="flex">
          <Button>Add Interval</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Interval</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Input
              value={progress}
              type="number"
              min={0}
              max={100}
              placeholder="progress"
              onChange={(e) => setProgress(+e.target.value)}
            />
            :
            <Input
              value={interval && interval / 8.64e7}
              placeholder="interval in days"
              type="number"
              onChange={(e) => setInterval(+e.target.value * 8.64e7)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button onClick={handleAdd}>Add</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
