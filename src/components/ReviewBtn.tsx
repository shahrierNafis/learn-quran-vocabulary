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
import getToReview from "@/utils/getToReview";
import { Tables } from "@/database.types";

export default function ReviewBtn({
  className,
  collection_id,
}: {
  className?: string;
  collection_id?: number;
}) {
  const [number, setNumber] = useState<number>(10);
  const [toReviewCount, setToReviewCount] = useState<number>(0);

  //set wordGroups
  useEffect(() => {
    getToReview(collection_id ? +collection_id : undefined).then(
      (wordGroups) => {
        setToReviewCount(wordGroups.length);
        if (wordGroups.length < 10) {
          setNumber(wordGroups.length);
        }
      }
    );
    return () => {};
  }, [collection_id, number]);
  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} asChild>
          <Button disabled={!toReviewCount} size={"sm"}>
            Review {toReviewCount > 0 && toReviewCount}
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
              max={toReviewCount}
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>
          <Link
            href={`/review/${number}${collection_id ? "?collection_id=" + collection_id : ""}`}
          >
            <Button className="w-fit ml-auto">Start</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
