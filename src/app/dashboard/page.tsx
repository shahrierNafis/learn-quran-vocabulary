"use client";

import Collections from "@/components/Collections";
import Review from "./Review";
import Preference from "./Preference";
import Count from "./Count";

export default function PrivatePage() {
  return (
    <>
      <div className="grid grid-cols-3 border max-w-fit mx-auto">
        <Count />
        <Review />
        <Preference />
      </div>
      <Collections />
    </>
  );
}
