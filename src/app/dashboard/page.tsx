"use client";

import Collections from "@/components/Collections";
import Review from "./Review";
import Count from "./Count";

export default function PrivatePage() {
  return (
    <>
      <div className="grid grid-cols-2 w-full">
        <Count />
        <Review />
      </div>
      <Collections />
    </>
  );
}
