"use client";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import PlayBtn from "@/components/PlayBtn";
export default function Review({
  toReviewCount,
}: {
  toReviewCount: number | null | undefined;
}) {
  return (
    <div className="flex flex-col p-2 basis-0 flex-grow justify-center items-center">
      {toReviewCount != undefined ? (
        <>
          <div className="text-nowrap">Ready for Review {toReviewCount}</div>
          <PlayBtn type="review">
            <Button disabled={toReviewCount === 0} size={"sm"}>
              Review{" "}
              {toReviewCount != undefined && toReviewCount > 0 && toReviewCount}
            </Button>
          </PlayBtn >
        </>
      ) : (
        "loading"
      )}
      <Popover>
        <PopoverTrigger>
          <div className="text-blue-500 text-sm hover:underline">
            How reviews work
          </div>
        </PopoverTrigger>
        <PopoverContent>
          A{" "}
          <a
            className="text-blue-500 hover:underline"
            href="https://en.wikipedia.org/wiki/Spaced_repetition"
            target="_blank"
          >
            spaced repetition system
          </a>{" "}
          is used to help you remember what you learn. Intervals are set to 1
          day (25% Mastered), 10 days (50% Mastered), 30 days (75% Mastered),
          and 180 days (100% Mastered) by default. You can customize the
          intervals. You can also manually master or reset verses at any time.
        </PopoverContent>
      </Popover>
    </div>
  );
}
