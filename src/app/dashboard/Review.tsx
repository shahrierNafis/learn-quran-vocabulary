"use client";

import { Tables } from "@/database.types";
import React, { useEffect, useState } from "react";
import getToReview from "../../utils/getToReview";
import ReviewBtn from "../../components/ReviewBtn";

export default function Review() {
  const [toReview, setToReview] = useState<Tables<"word_groups">[]>();
  useEffect(() => {
    getToReview().then(setToReview);
  }, []);
  return (
    <div className="flex flex-col p-2 border mx-auto max-w-fit">
      <div className="">Ready for Review</div>
      <div className="text-center">{toReview && toReview.length}</div>
      <ReviewBtn />
    </div>
  );
}
