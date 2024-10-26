"use client";

import { Tables } from "@/database.types";
import React, { useEffect, useState } from "react";
import getToReview from "../../utils/getToReview";
import ReviewBtn from "../../components/ReviewBtn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          <ReviewBtn {...{ toReviewCount }} />
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
          intervals. You can also manually master or reset sentences at any
          time.
        </PopoverContent>
      </Popover>
    </div>
  );
}
