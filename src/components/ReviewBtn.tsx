import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/Link";
import { Checkbox } from "./ui/checkbox";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function ReviewBtn({
  className,
  collection_id,
  toReviewCount,
}: {
  className?: string;
  collection_id?: number;
  toReviewCount?: number;
}) {
  const [number, setNumber] = useLocalStorage<number>("verses per round", 10);
  const [textInput, setTextInput] = useLocalStorage("mode", false);
  const [listening, setListening] = useLocalStorage("skill", false);

  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button disabled={toReviewCount === 0} size={"sm"}>
            Review{" "}
            {toReviewCount != undefined && toReviewCount > 0 && toReviewCount}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="">verses per round:</div>
            <Input
              className="w-20"
              min={1}
              max={toReviewCount}
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setTextInput(!textInput)}
          >
            <Checkbox checked={textInput} /> text Input (hard)
          </div><div
            className="flex items-center cursor-pointer"
            onClick={() => setListening(!listening)}
          >
            <Checkbox checked={listening} /> learn listening skill
          </div>
          <Link
            href={`/review/${number}?collection_id=${collection_id ?? ""}&mode=${textInput ? "text_input" : ""}&skill=${listening ? "listening" : ""}`}
          >
            <Button className="w-fit ml-auto">Start</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
