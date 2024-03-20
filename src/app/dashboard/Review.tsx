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
import { Button } from "@/components/ui/button";
export default function Review() {
  const [toReview, setToReview] = useState<Tables<"word_groups">[]>();
  useEffect(() => {
    getToReview().then(setToReview);
  }, []);
  return (
    <div className="flex flex-col p-2 border max-w-fit justify-center items-center">
      <div className="">Ready for Review</div>
      <div className="text-center">{toReview && toReview.length}</div>
      <ReviewBtn />
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
