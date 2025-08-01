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

export default function AddInterval({
  setInterval,
}: {
  setInterval: (percentage: number, newInterval: number) => void;
}) {
  const [progress, setProgress] = useState<number>();
  const [newInterval, setNewInterval] = useState<number>();
  function handleAdd() {
    if (progress === undefined || newInterval === undefined) return;
    setInterval(progress, newInterval);
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="flex">
          <Button>Add newInterval</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add new Interval</AlertDialogTitle>
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
              value={newInterval && newInterval / 8.64e7}
              placeholder="newInterval in days"
              type="number"
              onChange={(e) => setNewInterval(+e.target.value * 8.64e7)}
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
