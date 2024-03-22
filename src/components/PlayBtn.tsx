import { Button } from "@/components/ui/button";
import React, { useState } from "react";
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

export default function Learn({
  className,
  id,
}: {
  className?: string;
  id: string;
}) {
  const [number, setNumber] = useState<number>(10);
  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button size={"sm"}>Play</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="">sentences per round:</div>
            <Input
              className="w-20"
              min={1}
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>

          <Link href={`/play/${id}/${number}`}>
            <Button className="w-fit ml-auto">Start </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
