import { Amiri_Quran } from "next/font/google";
import { WordData } from "@/types/types";
import React from "react";
const amiri_quran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
});

function Word({ wordSegments }: { wordSegments: WordData }) {
  return (
    <div className={amiri_quran.className}>
      {wordSegments.map((s) => s.arabic.trim())}
    </div>
  );
}

export default Word;
