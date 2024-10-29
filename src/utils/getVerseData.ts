"use server";
import { WordData } from "@/types/types";
import { cache } from "react";

type SegmentData = {
  [key: number]: {
    [key: number]: {
      [key: number]: WordData;
    };
  };
};
const data: SegmentData = require("./../data.json");

export default cache(async function getWordData(surah: number, verse: number) {
  return data[surah][verse];
});
