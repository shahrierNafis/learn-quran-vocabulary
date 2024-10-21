"use client";
import BuyMeACoffee from "@/components/BuyMeACoffee";
import React from "react";

export default function Page() {
  return (
    <>
      <div className="w-[50vw] py-4 px-6 border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="font-bold p-1">Buy me a coffee</div>
        <BuyMeACoffee />
      </div>
    </>
  );
}
