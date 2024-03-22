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
import { ChevronRight } from "lucide-react";

export default function ReviewBtn({ className }: { className?: string }) {
  const [number, setNumber] = useState<number>(10);
  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button size={"sm"}>
            Review
            <ChevronRight className="m-[-.5rem]" strokeWidth={".15rem"} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="">Sentences per round:</div>
            <Input
              className="w-20"
              min={1}
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>
          <Link href={`/review/${number}`}>
            <Button className="w-fit ml-auto">Start</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
