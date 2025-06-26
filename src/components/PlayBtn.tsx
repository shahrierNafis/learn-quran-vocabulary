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
import { Checkbox } from "@/components/ui/checkbox";
export default function Learn({
  className,
  collection_id,
  size,
  wordGroupsCount,
}: {
  className?: string;
  collection_id: number;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  wordGroupsCount?: number | null | undefined;
}) {
  const [number, setNumber] = useState<number>(10);
  const [textInput, setTextInput] = useState(false);
  const [listening, setListening] = useState(true);

  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button disabled={wordGroupsCount === 0} size={size ?? "sm"}>
            Play
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="">verses per round:</div>
            <Input
              className="w-20"
              min={1}
              max={wordGroupsCount ?? 0}
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
          </div>{" "}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setListening(!listening)}
          >
            <Checkbox checked={listening} /> learn listening skill
          </div>
          <Link
            href={`/play/${collection_id}/${number}?mode=${textInput ? "text_input" : ""}&skill=${listening ? "listening" : ""}`}
          >
            <Button className="w-fit ml-auto">Start </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
