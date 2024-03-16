"use client";

import { Tables } from "@/database.types";
import React, { useEffect, useState } from "react";
import getProgresses from "../../utils/getProgresses";
import getToReview, { ToReview } from "./getToReview";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReviewBtn from "./ReviewBtn";
import { Progress } from "@/utils/getProgress";

export default function Review() {
  const [progresses, setProgresses] = useState<{
    [key: number]: Tables<"user_progress">;
  }>();
  const [toReview, setToReview] = useState<ToReview>();
  useEffect(() => {
    getProgresses().then(setProgresses);
    return () => {};
  }, []);
  useEffect(() => {
    progresses && getToReview(progresses).then(setToReview);
  }, [progresses]);
  return (
    <div className="flex flex-col p-2 border mx-auto max-w-fit">
      <div className="">Ready for Review</div>
      <div className="text-center">
        {toReview &&
          Object.keys(toReview).reduce((count, collection) => {
            return +count + toReview[+collection].toReview.length;
          }, 0)}
      </div>
      <ReviewBtn />
    </div>
  );
}
