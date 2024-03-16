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
import Link from "next/link";

export default function Learn({
  className,
  id,
}: {
  className: string;
  id: string;
}) {
  const [number, setNumber] = useState<number>(11);
  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)}>
          <Button>Learn</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Learn</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="">Words per round:</div>
            <Input
              className="w-20"
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>
          <Button className="w-fit ml-auto">
            <Link href={`/learn/${id}/${number}`}>Start</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
