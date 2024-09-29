"use server";
import { WordData } from "@/types/types";

type SegmentData = {
  [key: number]: {
    [key: number]: {
      [key: number]: WordData;
    };
  };
};
const data: SegmentData = require("./../data.json");

export default async function getWordData(
  surah: number,
  verse: number,
  word: number
) {
  return data[surah][verse][word];
}
