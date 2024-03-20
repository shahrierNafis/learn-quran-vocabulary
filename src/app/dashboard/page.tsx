"use client";

import Collections from "@/components/Collections";
import Review from "./Review";
import Preference from "./Preference";

export default function PrivatePage() {
  return (
    <>
      <div className="flex border mx-auto max-w-fit">
        <Review />
        <Preference />
      </div>
      <Collections />
    </>
  );
}
